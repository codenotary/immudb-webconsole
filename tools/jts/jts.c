#define _GNU_SOURCE         /* See feature_test_macros(7) */

#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <errno.h>
#include <poll.h>
#include <time.h>

int line=0;
void jprint(char *s, char* flux) {
	struct timespec tim;
	double tim2;
	clock_gettime(CLOCK_REALTIME, &tim);
	tim2=tim.tv_sec+(tim.tv_nsec/1E9);
	if (line++>0) 
		printf(",\n");
	printf("{\"timestamp\":%f,\"flux\":\"%s\",\"line\":\"",flux, tim2);
	for (char *c=s; *c!=0; c++) {
		switch (*c) {
			case '"': printf("\\\""); break;
			case '\\': printf("\\\\"); break;
			case '\b': printf("\\b"); break;
			case '\f': printf("\\f"); break;
			case '\n': printf("\\n"); break;
			case '\r': printf("\\r"); break;
			case '\t': printf("\\t"); break;
			default: 
				if (0x00 <= *c && *c <= 0x1f)
					printf("\\u%04X",*c); 
				else
					printf("%c",*c);
				break;
		}
	}
	printf("\"}");
}

void parent(pid_t pid, int outpipe[2], int errpipe[2]) {
	int status;
	close(outpipe[1]);
	close(errpipe[1]);
	printf("[\n");
	while (1) {
		struct pollfd p[2];
		p[0].fd=outpipe[0]; p[0].events=POLLIN;
		p[1].fd=errpipe[0]; p[1].events=POLLIN;
		if (poll(p,2,10000) <=0) {
			printf("poll timeout\n");
			break;
		}
		if (p[0].revents & POLLIN) {
			char buffer[4096];
			ssize_t count = read(outpipe[0], buffer, sizeof(buffer));
			if (count == -1) {
				break;
			}
			buffer[count]=0;
			jprint(buffer,"stdout");
		}
		if (p[1].revents & POLLIN) {
			char buffer[4096];
			ssize_t count = read(errpipe[0], buffer, sizeof(buffer));
			if (count == -1) {
				break;
			}
			buffer[count]=0;
			jprint(buffer,"stderr");
		}
 		if ((p[0].revents|p[1].revents) & (POLLRDHUP|POLLERR|POLLHUP|POLLNVAL)) {
 			break;
 		}
	}
	waitpid(pid, &status, 0);
	close(outpipe[0]);
	if (line>0)
		printf("\n");
	printf("]\n");
}

void child(char ** argv, int outpipe[2], int errpipe[2]) {
	dup2(outpipe[1], STDOUT_FILENO);
	dup2(errpipe[1], STDERR_FILENO);
 	close(outpipe[0]);
 	close(outpipe[1]);
 	close(errpipe[0]);
 	close(errpipe[1]);
	execv(argv[1],argv+1);
}

int main(int argc, char ** argv) {
	int fd_out[2], fd_err[2];
	if (pipe(fd_out)==-1 || pipe(fd_err)==-1) {
		printf("Failed to pipe\n");
		return -1;
	}
	pid_t pid = fork();

	if (pid == -1) {
		printf("Failed to fork\n");
		return -1;
	} 
	else if (pid > 0) {
		parent(pid,fd_out, fd_err);
	}
	else {
	// we are the child
		child(argv, fd_out, fd_err);
		_exit(-2);   // exec never returns
	}
}
