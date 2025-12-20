const fs = require('fs');
const path = require('path');

const tsvFiles = [
    'アクター.tsv',
    '外部システム.tsv', 
    '情報.tsv',
    '状態.tsv',
    '条件.tsv',
    'バリエーション.tsv',
    'BUC.tsv'
];

const rdraDir = path.resolve(__dirname, '..', '..', '1_RDRA');
const outputFile = path.join(rdraDir, 'ZeroOne.txt');

function integrateRDRAFiles() {
    // システム概要ファイルからシステム名を取得
    const systemOverviewPath = path.join(rdraDir, 'システム概要.json');
    let systemName = '';
    
    if (fs.existsSync(systemOverviewPath)) {
        try {
            const systemOverview = JSON.parse(fs.readFileSync(systemOverviewPath, 'utf-8'));
            systemName = systemOverview.system_name || '';
        } catch (error) {
            console.log('Warning: システム概要.json の読み込みに失敗しました');
        }
    }
    
    let integratedContent = '';
    
    // 先頭行にブランクカラムとシステム名を出力
    if (systemName) {
        integratedContent += '\t' + systemName + '\n';
    }
    
    for (const tsvFile of tsvFiles) {
        const filePath = path.join(rdraDir, tsvFile);
        
        if (fs.existsSync(filePath)) {
            const fileName = path.parse(tsvFile).name;
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split('\n').filter(line => line.trim() !== '');
            
            // ファイル名行に「A」を付加
            integratedContent += 'A\t' + fileName + '\n';
            
            // 各行を処理
            for (let i = 0; i < lines.length; i++) {
                if (i === 0) {
                    // ヘッダー行に「C」を付加
                    integratedContent += 'C\t' + lines[i] + '\n';
                } else {
                    // 内容行に「B」を付加
                    integratedContent += 'B\t' + lines[i] + '\n';
                }
            }
        } else {
            console.log(`Warning: ${tsvFile} not found, skipping...`);
        }
    }
    
    // ZeroOne.txtファイルに出力
    fs.writeFileSync(outputFile, integratedContent, 'utf-8');
    console.log(`統合ファイル ${outputFile} を作成しました`);
    
    return outputFile;
}

// 実行
integrateRDRAFiles();
