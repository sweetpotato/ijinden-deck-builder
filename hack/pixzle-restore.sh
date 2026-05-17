#!/bin/bash
export LANG=C LC_ALL=C
set -Cxueo pipefail

declare bin="$(dirname "${BASH_SOURCE[0]}")"

main() {
	local -i width=110 height=154 bs=22 seed=6880780254253071
	local src_dir dst_dir
	src_dir="${1}"
	dst_dir="${2}"

	src_files=($(find "${src_dir}" -name '*.png' | sort))

	local f
	for f in "${src_files[@]}" ; do
		"${bin}/../node_modules/.bin/pixzle" restore "${f}" \
		  -o "${dst_dir}" -b "${bs}" -s "${seed}" -w "${width}" -h "${height}"
		mv "${dst_dir}/img_1.png" "${dst_dir}/$(basename "$f")"
	done
}

main "$@"
exit 0
