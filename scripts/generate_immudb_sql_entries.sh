#!/bin/bash

REPORT_TYPES=(
    dependency
    package
    artifact
    docker
    build
    deployment
)

dependency_COUNT=10000
dependency_FIRST_ID=1000000000
dependency_USED=100

package_COUNT=10000
package_FIRST_ID=2000000000
package_USED=100

artifact_COUNT=1000
artifact_FIRST_ID=3000000000
artifact_USED=10
artifact_RELIES_ON_dependency=5

docker_COUNT=1000
docker_FIRST_ID=4000000000
docker_USED=10
docker_RELIES_ON_package=5

build_COUNT=100
build_FIRST_ID=5000000000
build_USED=4
build_RELIES_ON_artifact=5

deployment_COUNT=30
deployment_FIRST_ID=6000000000
deployment_USED=1
deployment_RELIES_ON_docker=5
deployment_RELIES_ON_build=2
deployment_RELIES_ON_artifact=3


MAX_TRUST_LEVEL=10

set -euo pipefail

IMMUCLIENT="./../../immudb/immuclient"


login() {
    $IMMUCLIENT login immudb --password immudb
}

generate_schema() {

    $IMMUCLIENT exec "

    CREATE TABLE report(
        id                  INTEGER,
        name                VARCHAR,
        kind                VARCHAR,
        hash                VARCHAR,
        trust_level         INTEGER,
        signer              INTEGER,
        creation_time       INTEGER,
        last_update_time    INTEGER,

        PRIMARY KEY id
    );

    CREATE INDEX ON report(name);
    CREATE INDEX ON report(kind);
    CREATE INDEX ON report(hash);

    CREATE TABLE relies_on(
        id                      INTEGER AUTO_INCREMENT,
        report_id               INTEGER,
        relies_on_report_id     INTEGER,

        PRIMARY KEY id
    );

    CREATE INDEX ON relies_on(report_id);
    CREATE INDEX ON relies_on(relies_on_report_id);

    CREATE TABLE report_attribute(
        id          INTEGER AUTO_INCREMENT,
        report_id   INTEGER,
        name        VARCHAR,
        value       VARCHAR,

        PRIMARY KEY id
    );

    CREATE INDEX ON report_attribute(report_id);

    CREATE TABLE report_attachment(
        id              INTEGER AUTO_INCREMENT,
        report_id       INTEGER,
        file_name       VARCHAR,
        content_type    VARCHAR,
        binary_data     BLOB,

        PRIMARY KEY id
    );

    CREATE INDEX ON report_attachment(report_id);
    "
}

_var() {
    echo "${!1:-0}"
}

generate_reports() {
    name="$1"
    count="$(_var ${name}_COUNT)"
    start_id="$(_var ${name}_FIRST_ID)"

    batch_size=100

    echo "Crearing reports for $name"
    for (( i = 0; i < $count; i += $batch_size )); do
        echo "Creating ${name}... $i"
        $IMMUCLIENT exec "$( for (( j = 0; j < $batch_size; j++ )); do
            k=$(( $i + $j ))
            id=$(( $start_id + $k ))
            if [ "$k" -lt "$count" ]; then
                echo "
                    INSERT INTO report(
                        id, name, kind, hash, trust_level, signer, creation_time, last_update_time
                    ) VALUES (
                        $id,
                        '${name}_$k',
                        '${name}',
                        'hash_${name}_$k',
                        $(( $k % $MAX_TRUST_LEVEL )),
                        0,
                        NOW(),
                        NOW()
                    );
                "
            fi
        done )"
    done
}

generate_all_reports() {
    for type in ${REPORT_TYPES[@]}; do
        generate_reports "$type"
    done
}

generate_relies_on() {
    name="$1"
    count="$(_var ${name}_COUNT)"
    start_id="$(_var ${name}_FIRST_ID)"
    relies_on_name="$2"
    relies_on_start_id="$(_var ${relies_on_name}_FIRST_ID)"
    relies_on_count="$(_var ${name}_RELIES_ON_${relies_on_name})"
    relies_on_used="$(_var ${relies_on_name}_USED)"

    if [[ $relies_on_count == "0" ]]; then
        return
    fi

    batch_size=100

    echo "Crearing relies on relations for $name -> $relies_on_name"
    for (( i = 0; i < $count; i += $batch_size )); do
        echo "Creating dependencies for ${name} $i"
        $IMMUCLIENT exec "$( for (( j = 0; j < $batch_size; j++ )); do
            k=$(( $i + $j ))
            id=$(( $start_id + $k ))
            if [ "$k" -lt "$count" ]; then
                for (( l=0; l < $relies_on_count; l++ )); do echo "
                    INSERT INTO relies_on(
                        report_id, relies_on_report_id
                    ) VALUES (
                        $id,
                        $(( $relies_on_start_id + ( ( ($id + $l) * 578077 ) % $relies_on_used ) ))
                    );
                "; done
            fi
        done )"
    done
}

generate_all_relies_on() {
    for type in ${REPORT_TYPES[@]}; do
        for relies_on_type in ${REPORT_TYPES[@]}; do
            generate_relies_on "$type" "$relies_on_type"
        done
    done
}

login
generate_schema
generate_all_reports
generate_all_relies_on
