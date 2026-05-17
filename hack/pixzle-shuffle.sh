#!/bin/bash
export LANG=C LC_ALL=C
set -Cxueo pipefail

declare bin="$(dirname "${BASH_SOURCE[0]}")"

main() {
	local -i bs=22
	local seed=qnoaMuW16MLQ
	local src_dir dst_dir
	src_dir="${1}"
	dst_dir="${2}"

	src_files=($(find "${src_dir}" -name '*.png' | sort))

	local f
	for f in "${src_files[@]}" ; do
		"${bin}/../node_modules/.bin/pixzle" shuffle "${f}" \
			-o "${dst_dir}" -b "${bs}" -s "${seed}"
		mv "${dst_dir}/img_1_fragmented.png" "${dst_dir}/$(basename "$f")"
	done
	rm "${dst_dir}/manifest.json"
}

main "$@"
exit 0
