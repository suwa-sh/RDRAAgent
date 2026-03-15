#!/usr/bin/env node

const readline = require('readline');
const { createMenuAction } = require('./RDRA_Knowledge/helper_tools/menuAction');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
<<<<<<< HEAD
/**
 * プラットフォームに応じたLLMターミナル起動コマンドを生成する
 * @returns {string|null} ターミナルコマンド文字列、またはサポートされていない場合null
 */
function getLLMTerminalCommand(runPprompt) {
    const platform = process.platform;
    if (platform === 'win32') {
        // Windowsの場合：専用バッチファイルを呼び出す
        const prompt = 'start cmd /k "RDRA_Knowledge\\helper_tools\\command\\commandRun.bat claude "' + "\"" +runPprompt + "\"";
        console.log(prompt);
        return prompt;
    } else if (platform === 'darwin') {
        // macOSの場合：専用シェルスクリプトを呼び出す
        const scriptPath = 'RDRA_Knowledge/helper_tools/command/commandRun.sh';
        const currentDir = process.cwd();
        const prompt = `osascript -e 'tell application "Terminal" to do script "cd \\"${currentDir}\\" && bash ${scriptPath} claude -p --permission-mode bypassPermissions\\"${runPprompt}\\""'`;
        console.log(prompt);
        return prompt;
    } else {
        return null;
    }
}
/**
 * プラットフォームに応じたクリップボードコマンドを生成する
 * @param {string} filePath - コピーするファイルのパス
 * @returns {string|null} クリップボードコマンド文字列、またはサポートされていない場合null
 */
function getClipboardCommand(filePath) {
    const platform = process.platform;
    if (platform === 'win32') {
        // Windowsの場合：PowerShellを使用
        const windowsPath = filePath.replace(/\//g, '\\');
        return `powershell -Command "Get-Content -Path ${windowsPath} -Encoding UTF8 | Set-Clipboard"`;
    } else if (platform === 'darwin') {
        // macOSの場合：pbcopyを使用
        return `cat "${filePath}" | pbcopy`;
    } else {
        return null;
    }
}
/**
 * プラットフォームに応じたブラウザ起動コマンドを生成する
 * @param {string} url - 開くURL
 * @returns {string|null} ブラウザ起動コマンド文字列、またはサポートされていない場合null
 */
function getBrowserCommand(url) {
    const platform = process.platform;
    if (platform === 'win32') {
        // Windowsの場合：startコマンドを使用
        return `powershell -Command "Start-Process ${url}"`;
    } else if (platform === 'darwin') {
        // macOSの場合：openコマンドを使用
        return `open "${url}"`;
    } else {
        return null;
    }
}
/**
 * RDRAZeroOne　Phase1~Phase4 RDRA RDRASpecのファイル
 */
const phase1Files = [
    'アクター.tsv',
    '外部システム.tsv',
    'ビジネスポリシー.tsv',
    '業務.tsv',
    '情報.tsv',
    '状態.tsv'
];
const phase2Files = [
    '業務.tsv',
    '条件.tsv',
    'バリエーション.tsv',
    '情報.tsv',
    '状態.tsv'
];
const phase3Files = [
    'アクター.tsv',
    '外部システム.tsv',
    '条件.tsv',
    'バリエーション.tsv',
    '情報.tsv',
    '状態.tsv',
    'BUC.tsv',
];
const phase4Files = [
    'BUC.tsv',
    '条件.tsv',
    '情報.tsv',
    '状態.tsv'
];
const rdraFiles = [
    'システム概要.json',
    'BUC.tsv',
    'アクター.tsv',
    '外部システム.tsv',
    '情報.tsv',
    '状態.tsv',
    '条件.tsv',
    'バリエーション.tsv'
];
const specFiles = [
    'business_rule.md',
    'ui.json',
    '論理データ.tsv',
    '論理データモデル.md'
];
/**
 * 指定した配列のファイル名が全て指定フォルダー内に存在するか確認する
 * @param {string[]} fileNames - チェックするファイル名の配列
 * @param {string} folderPath - 検査するフォルダーのパス
 * @returns {boolean} - 全て存在すればtrue、1つでもなければfalse
 */
function checkAllFilesExistInFolder(fileNames, folderPath) {
    const fs = require('fs');
    try {
        // 正規化関数（NFC に統一）
         const normalize = s => s.normalize('NFC');
        // フォルダ側を正規化
        const filesInDir = fs.readdirSync(folderPath);
        const filesInDirNormalized = filesInDir.map(normalize);
        return fileNames.every(file => filesInDirNormalized.includes(file));
    } catch (err) {
        console.error(`ディレクトリの読み込みエラー: ${err}`);
        return false;
    }
}
function waitForEnterThenNext() {
    console.log('続行するにはEnterキーを押してください...');
    process.stdin.once('data', () => {
        promptUser();
    });
}
=======
rl.setPrompt('> ');

>>>>>>> ee0cff5b885c5a31209ff3150de4a894939873d3
/**
 * メニューを表示する
 */
function showMenu() {
    console.log('■ZeroOne');
    console.log('1.フェーズ単位実行：成果物が無い最初のPhaseを実行（Phase4が揃っていればPhase5を実行）');
    console.log('2.一括要件定義：RDRA定義を一括実行する');
    console.log('■RDRA');
    console.log('11.RDRAGraphを表示：関連データを作成しRDRAGraphを表示');
    console.log('12.Spreadsheetに展開：RDRA定義をクリップボードにコピー');
    console.log('■RDRASpec：仕様');
    console.log('21.仕様の作成：論理データ構造/画面/ビジネスルール');
    console.log('22.BUC・アクター別画面を表示する');
    console.log('■全般');
    console.log('0.メニュー終了');
    console.log('');
    console.log('99.生成した成果物の削除：0_RDRAZeroOne/1_RDRA/2_RDRASpec');
    console.log('');
    console.log('実行したい番号を入力してください');
}

let executeOption;
// 入力の受け口を切り替える（Enter待ち / メニュー入力）
let inputHandler = null;

function handleMenuInput(line) {
    executeOption(line.trim());
}

function waitForEnterThenNext() {
    console.log('続行するにはEnterキーを押してください...');
    inputHandler = () => {
        promptUser();
    };
    rl.prompt();
}

function promptUser() {
    showMenu();
    inputHandler = handleMenuInput;
    rl.prompt();
}

rl.on('line', (line) => {
    if (inputHandler) inputHandler(line);
});

executeOption = createMenuAction({ rl, promptUser, waitForEnterThenNext });

console.log('コマンド実行メニュー');
promptUser();
