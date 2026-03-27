#!/usr/bin/env node
/**
 * Spec バリデータ（UC 単位）
 *
 * Usage:
 *   node validateSpec.js <path-to-spec-event-dir>
 *   node validateSpec.js docs/specs/events/20260326_120000_add_review_feature
 *
 * 検証内容:
 *   1. UC ディレクトリごとに spec.md が存在する
 *   2. spec.md に必須セクション（概要、関連RDRAモデル、E2E完了条件、ティア別仕様）がある
 *   3. BDD シナリオに Given/When/Then が含まれる
 *   4. tier ファイルに必須セクション（変更概要、完了条件）がある
 *   5. UC ディレクトリ名にスラッシュが含まれない
 *
 * 終了コード:
 *   0 = 全チェック PASS
 *   1 = バリデーションエラーあり
 *   2 = ファイル読み込みエラー
 */
'use strict';

const fs = require('fs');
const path = require('path');

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node validateSpec.js <path-to-spec-event-dir>');
    process.exit(2);
  }

  const specEventDir = path.resolve(args[0]);
  if (!fs.existsSync(specEventDir)) {
    console.error(`Directory not found: ${specEventDir}`);
    process.exit(2);
  }

  const errors = [];
  const warnings = [];

  // UC ディレクトリを列挙
  const entries = fs.readdirSync(specEventDir, { withFileTypes: true });
  const ucDirs = entries.filter(e => e.isDirectory()).map(e => e.name);

  if (ucDirs.length === 0) {
    errors.push('UC ディレクトリが1つも存在しません');
    printResult(specEventDir, errors, warnings, []);
    process.exit(1);
  }

  const ucResults = [];

  for (const ucName of ucDirs) {
    const ucDir = path.join(specEventDir, ucName);
    const ucErrors = [];
    const ucWarnings = [];

    // ディレクトリ名検証
    if (ucName.includes('/')) {
      ucErrors.push(`ディレクトリ名にスラッシュが含まれています: "${ucName}"`);
    }

    // --- spec.md 検証 ---
    const specPath = path.join(ucDir, 'spec.md');
    if (!fs.existsSync(specPath)) {
      ucErrors.push('spec.md が存在しません');
    } else {
      const content = fs.readFileSync(specPath, 'utf8');

      // 必須セクション
      const requiredSections = [
        { heading: '概要', required: true },
        { heading: '関連', required: true },  // "関連 RDRA モデル" or "関連RDRA" etc.
        { heading: 'E2E', required: true },    // "E2E 完了条件" or "E2E完了条件"
        { heading: 'ティア', required: true }, // "ティア別仕様" or "ティアごとの変更"
      ];

      for (const { heading, required } of requiredSections) {
        const regex = new RegExp(`##.*${heading}`, 'i');
        if (!regex.test(content)) {
          if (required) {
            ucErrors.push(`spec.md に "${heading}" を含むセクションがありません`);
          }
        }
      }

      // BDD シナリオ検証
      const hasGiven = /Given/i.test(content);
      const hasWhen = /When/i.test(content);
      const hasThen = /Then/i.test(content);
      if (!hasGiven || !hasWhen || !hasThen) {
        ucErrors.push(`spec.md に BDD シナリオ（Given/When/Then）が不完全です (Given:${hasGiven} When:${hasWhen} Then:${hasThen})`);
      }

      // Gherkin ブロック検証（```gherkin があるか）
      if (!content.includes('gherkin') && !content.includes('Scenario')) {
        ucWarnings.push('spec.md に Gherkin フォーマット（```gherkin or Scenario:）が見つかりません');
      }

      // 関連RDRAモデルのテーブル検証
      if (!content.includes('| モデル種別') && !content.includes('|モデル種別')) {
        ucWarnings.push('spec.md の関連RDRAモデルがテーブル形式ではありません');
      }
    }

    // --- tier ファイル検証 ---
    const tierFiles = fs.readdirSync(ucDir).filter(f => f.startsWith('tier-') && f.endsWith('.md'));

    if (tierFiles.length === 0) {
      ucErrors.push('tier ファイル（tier-frontend.md, tier-backend.md 等）が1つも存在しません');
    }

    for (const tierFile of tierFiles) {
      const tierPath = path.join(ucDir, tierFile);
      const content = fs.readFileSync(tierPath, 'utf8');

      // 変更概要セクション
      if (!/##.*変更概要|##.*変更内容/i.test(content)) {
        ucWarnings.push(`${tierFile}: "変更概要" または "変更内容" セクションがありません`);
      }

      // 完了条件セクション
      if (!/##.*完了条件/i.test(content)) {
        ucWarnings.push(`${tierFile}: "完了条件" セクションがありません`);
      }

      // BDD 存在チェック（ティア完了条件内）
      const hasBDD = /Given/i.test(content) && /When/i.test(content) && /Then/i.test(content);
      if (!hasBDD) {
        ucWarnings.push(`${tierFile}: BDD シナリオ（Given/When/Then）がありません`);
      }

      // tier-backend.md 固有チェック
      if (tierFile === 'tier-backend.md') {
        if (!/API|エンドポイント|メソッド/i.test(content)) {
          ucWarnings.push('tier-backend.md: API 仕様の記述が見つかりません');
        }
      }

      // tier-frontend.md 固有チェック
      if (tierFile === 'tier-frontend.md') {
        if (!/画面|URL|表示/i.test(content)) {
          ucWarnings.push('tier-frontend.md: 画面仕様の記述が見つかりません');
        }
      }
    }

    ucResults.push({ ucName, errors: ucErrors, warnings: ucWarnings, tierFiles });
    errors.push(...ucErrors.map(e => `[${ucName}] ${e}`));
    warnings.push(...ucWarnings.map(w => `[${ucName}] ${w}`));
  }

  printResult(specEventDir, errors, warnings, ucResults);
  process.exit(errors.length > 0 ? 1 : 0);
}

function printResult(dir, errors, warnings, ucResults) {
  if (errors.length === 0) {
    console.log(`PASS${warnings.length > 0 ? ' (with warnings)' : ''}: ${dir}`);
    console.log(`  UC count: ${ucResults.length}`);
    for (const uc of ucResults) {
      console.log(`  - ${uc.ucName}: spec.md + ${uc.tierFiles.join(', ')}`);
    }
    if (warnings.length > 0) {
      for (const w of warnings) {
        console.log(`  WARN: ${w}`);
      }
    }
  } else {
    console.log(`FAIL: ${dir}`);
    console.log(`  ${errors.length} error(s), ${warnings.length} warning(s):`);
    for (const e of errors) {
      console.log(`  ERROR: ${e}`);
    }
    for (const w of warnings) {
      console.log(`  WARN: ${w}`);
    }
  }
}

main();
