'use strict';

/**
 * RDRAファイルコピースクリプト
 *
 * phase1/phase4 の成果物を 1_RDRA/ にコピーする。
 * 条件.tsv, バリエーション.tsv, 状態.tsv, BUC.tsv は
 * attachContext.js と makeBUC.js が生成するので除外する。
 *
 * 実行時のカレントディレクトリに 0_RDRAZeroOne/ が存在する前提。
 */

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();
const TARGET_DIR = path.join(projectRoot, '1_RDRA');

// コピー対象: [コピー元, コピー先ファイル名]
const COPY_PLAN = [
    {
        source: path.join(projectRoot, '0_RDRAZeroOne', 'phase1', 'システム概要.json'),
        target: path.join(TARGET_DIR, 'システム概要.json'),
    },
    {
        source: path.join(projectRoot, '0_RDRAZeroOne', 'phase4', 'ph4アクター.tsv'),
        target: path.join(TARGET_DIR, 'アクター.tsv'),
    },
    {
        source: path.join(projectRoot, '0_RDRAZeroOne', 'phase4', 'ph4外部システム.tsv'),
        target: path.join(TARGET_DIR, '外部システム.tsv'),
    },
    {
        source: path.join(projectRoot, '0_RDRAZeroOne', 'phase4', 'ph4情報.tsv'),
        target: path.join(TARGET_DIR, '情報.tsv'),
    },
];

function main() {
    console.log('=== RDRAファイルコピー ===');

    // 1_RDRA ディレクトリの作成
    fs.mkdirSync(TARGET_DIR, { recursive: true });

    let successCount = 0;
    const missing = [];

    for (const { source, target } of COPY_PLAN) {
        if (!fs.existsSync(source)) {
            missing.push(source);
            console.error(`✗ 入力ファイルが見つかりません: ${source}`);
            continue;
        }
        try {
            fs.copyFileSync(source, target);
            const srcName = path.basename(source);
            const dstName = path.basename(target);
            const label = srcName !== dstName ? `${srcName} -> ${dstName}` : srcName;
            console.log(`✓ ${label}`);
            successCount++;
        } catch (error) {
            console.error(`✗ コピー失敗: ${path.basename(target)} - ${error.message}`);
        }
    }

    console.log(`\n成功: ${successCount}/${COPY_PLAN.length} ファイル`);

    if (missing.length > 0) {
        process.exit(1);
    }
}

main();
