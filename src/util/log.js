const TAGS = {
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    INFO: 'INFO'
}
// 字色编号：30黑，31红，32绿，33黄，34蓝，35紫，36深绿，37白色
// 背景编号：40黑，41红，42绿，43黄，44蓝，45紫，46深绿，47白色

// \033[0m 关闭所有属性
// \033[1m 设置高亮度
// \033[4m 下划线
// \033[5m 闪烁
// \033[7m 反显
// \033[8m 消隐
// \033[nA 光标上移n行
// \033[nB 光标下移n行
// \033[nC 光标右移n列
// \033[nD 光标左移n列
// \033[y;xH 设置光标位置（y列x行）
// \033[2J 清屏
// \033[K 清除从光标到行尾的内容
const log = (content, tag, title) => {
    let tagStr = '',
        titleStr = '',
        contentStr = '\033[90m' + content + '\033[0m';
    switch (tag) {
        case TAGS.SUCCESS: {
            tagStr = '\033[42m\033[37m[SUCCESS]:\033[0m    ';
            contentStr = '\033[32m' + content + '\033[0m';
            break;
        }
        case TAGS.FAILED: {
            tagStr = '\033[41m\033[37m[FAILED]:\033[0m     ';
            contentStr = '\033[31m' + content + '\033[0m';
            break;
        }
        case TAGS.INFO: {
            tagStr = '\033[44m\033[37m[INFO]:\033[0m       ';
            break;
        }
        default: {
            tagStr = '';
        }
    }
    if (title) {
        titleStr = '\033[90m[' + title + ']--->\033[0m'
    }
    console.log(tagStr + titleStr + contentStr);
}


module.exports = {
    TAGS,
    log
}