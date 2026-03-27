#!/usr/bin/env bash
set -euo pipefail

# RDRAAgent スキルセットアップ
# .claude/skills/ 配下の各スキルを、指定先にシンボリックリンクで配置する。
#
# Usage:
#   ./install.sh              # ~/.claude/skills/ にリンク（グローバル）
#   ./install.sh /path/to/project  # <project>/.claude/skills/ にリンク（プロジェクト固有）

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SOURCE_SKILLS_DIR="${SCRIPT_DIR}/.claude/skills"

if [ ! -d "${SOURCE_SKILLS_DIR}" ]; then
  echo "ERROR: ${SOURCE_SKILLS_DIR} が見つかりません" >&2
  exit 1
fi

# リンク先の決定
if [ $# -ge 1 ]; then
  TARGET_BASE="$1/.claude/skills"
else
  TARGET_BASE="${HOME}/.claude/skills"
fi

mkdir -p "${TARGET_BASE}"

linked=0
for skill_dir in "${SOURCE_SKILLS_DIR}"/*/; do
  [ -d "${skill_dir}" ] || continue
  skill_name="$(basename "${skill_dir}")"
  target="${TARGET_BASE}/${skill_name}"

  if [ -L "${target}" ]; then
    current="$(readlink "${target}")"
    if [ "${current}" = "${skill_dir%/}" ]; then
      echo "SKIP: ${skill_name} (already linked)"
      continue
    fi
    echo "UPDATE: ${skill_name} (re-linking)"
    rm "${target}"
  elif [ -e "${target}" ]; then
    echo "WARN: ${target} already exists (not a symlink). Skipping." >&2
    continue
  else
    echo "LINK: ${skill_name}"
  fi

  ln -s "${skill_dir%/}" "${target}"
  linked=$((linked + 1))
done

echo ""
echo "Done. ${linked} skill(s) linked to ${TARGET_BASE}"
