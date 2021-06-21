<template>
	<v-system-bar
		v-if="value"
		id="TheBanner"
		class="ma-0 pa-0 d-flex justify-center align-center"
		:height="32"
		:color="color"
		fixed
		app
	>
		<v-spacer
			v-if="!persistent"
			class="ml-4"
		/>
		<slot>
			<v-icon
				class="ma-0 pa-0 white--text"
				:size="18"
			>
				{{ icon }}
			</v-icon>
			<span
				v-if="title === CHANGE_SYSADMIN_PASSWORD"
				class="ma-0 ml-2 pa-0 subtitle-2 white--text text-center font-weight-bold"
			>
				immudb user has the default password: please
				<span
					class="white--text text-decoration-underline cursor-pointer"
					@click="onSubmit"
				>
					change it to ensure proper security!
				</span>
			</span>
			<span
				v-else
				class="ma-0 ml-2 pa-0 subtitle-2 white--text text-center font-weight-bold"
			>
				{{ title }}
			</span>
		</slot>
		<v-spacer
			v-if="!persistent"
		/>
		<v-btn
			v-if="!persistent"
			class="ma-0 mr-4 pa-0 text-center"
			text
			icon
			dense
			x-small
			@click="onClose"
		>
			<v-icon
				class="ma-0 pa-0"
				:size="18"
			>
				{{ mdiClose }}
			</v-icon>
		</v-btn>
	</v-system-bar>
</template>

<script>
import {
	mdiAlert,
	mdiStar,
	mdiClose,
} from '@mdi/js';

const CHANGE_SYSADMIN_PASSWORD = 'immudb user has the default password: please change it to ensure proper security';

export default {
	name: 'TheBanner',
	props: {
		value: { type: Boolean, default: false },
		title: { type: String, default: '' },
		subtitle: { type: String, default: '' },
		color: { type: String, default: 'primary' },
		persistent: { type: Boolean, default: false },
		icon: { type: String, default: mdiAlert },
	},
	data () {
		return {
			mdiAlert,
			mdiStar,
			mdiClose,
			CHANGE_SYSADMIN_PASSWORD,
			height: 1,
		};
	},
	methods: {
		onClose () {
			this.$emit('close');
		},
		onSubmit () {
			this.$router.push(this.localePath({ name: 'users' }));
			setTimeout(() => {
				this.$eventbus && this.$eventbus
						.$emit('EVENT_BUS==>updateSysadminPassword');
			}, 300);
		},
	},
};
</script>

<style lang="scss">
#TheBanner {
	a {
		&:hover {
			span {
				text-decoration: underline !important;
			}
		}
	}
}
</style>
