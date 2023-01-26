"use strict";
// edit from https://github.com/takayama-lily/oicq/blob/main/lib/internal/contactable.ts#L422-L511
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeForwardMsg = void 0;
const node_crypto_1 = require("node:crypto");
const node_stream_1 = require("node:stream");
const internal_1 = require("oicq/lib/internal");
const message_1 = require("oicq/lib/message");
const errors_1 = require("oicq/lib/errors");
const common_1 = require("oicq/lib/common");
const core_1 = require("oicq/lib/core");
/** 制作合并转发消息，可自定义标题、内容、底部说明文字 */
async function makeForwardMsg(msglist, title = '转发的聊天记录', desc = '轻按查看详情', dm = true) {
    const that = (dm ? this.pickFriend : this.pickGroup)(this.uin);
    if (!Array.isArray(msglist))
        msglist = [msglist];
    const nodes = [];
    const makers = [];
    let imgs = [];
    let preview = '';
    let cnt = 0;
    for (const fake of msglist) {
        const maker = new message_1.Converter(fake.message, { dm, cachedir: this.config.data_dir });
        makers.push(maker);
        const seq = (0, node_crypto_1.randomBytes)(2).readInt16BE();
        const rand = (0, node_crypto_1.randomBytes)(4).readInt32BE();
        let nickname = String(fake.nickname || fake.user_id);
        if (!nickname && fake instanceof message_1.PrivateMessage)
            nickname =
                this.fl.get(fake.user_id)?.nickname || this.sl.get(fake.user_id)?.nickname || nickname;
        if (cnt < 4) {
            cnt++;
            if (!desc) {
                preview += `<title color="#777777" size="26">${`${(0, common_1.escapeXml)(nickname)}: ${(0, common_1.escapeXml)(maker.brief.slice(0, 50))}`}</title>`;
            }
        }
        nodes.push({
            1: {
                1: fake.user_id,
                2: this.uin,
                3: dm ? 166 : 82,
                4: dm ? 11 : null,
                5: seq,
                6: fake.time || (0, common_1.timestamp)(),
                7: (0, message_1.rand2uuid)(rand),
                9: dm
                    ? null
                    : {
                        1: this.uin,
                        4: nickname
                    },
                14: dm ? nickname : null,
                20: {
                    1: 0,
                    2: rand
                }
            },
            3: {
                1: maker.rich
            }
        });
    }
    if (desc)
        preview = `<title color="#777777" size="26">${desc}</title>`;
    for (const maker of makers)
        imgs = [...imgs, ...maker.imgs];
    if (imgs.length)
        await that.uploadImages(imgs);
    const compressed = await (0, common_1.gzip)(core_1.pb.encode({
        1: nodes,
        2: {
            1: 'MultiMsg',
            2: {
                1: nodes
            }
        }
    }));
    const resid = await uploadMultiMsg.bind(this)(compressed);
    const xml = `<?xml version="1.0" encoding="utf-8"?>
<msg brief="[聊天记录]" m_fileName="${(0, common_1.uuid)().toUpperCase()}" action="viewMultiMsg" tSum="${nodes.length}" flag="3" m_resid="${resid}" serviceID="35" m_fileSize="${compressed.length}"><item layout="1"><title color="#000000" size="34"> ${title} </title>${preview}<hr></hr><summary color="#808080" size="26"> ${`查看 ${nodes.length} 条转发消息`} </summary></item><source name="聊天记录"></source></msg>`;
    const res = {
        type: 'xml',
        data: xml,
        id: 35,
        toString() {
            return `[XML 消息: ${title}]`;
        }
    };
    return res;
}
exports.makeForwardMsg = makeForwardMsg;
async function uploadMultiMsg(compressed) {
    const body = core_1.pb.encode({
        1: 1,
        2: 5,
        3: 9,
        4: 3,
        5: this.apk.version,
        6: [
            {
                1: this.uin,
                2: compressed.length,
                3: (0, common_1.md5)(compressed),
                4: 3,
                5: 0
            }
        ],
        8: 1
    });
    const payload = await this.sendUni('MultiMsg.ApplyUp', body);
    const rsp = core_1.pb.decode(payload)[2];
    if (rsp[1] !== 0)
        (0, errors_1.drop)(rsp[1], rsp[2]?.toString() || 'unknown MultiMsg.ApplyUp error');
    const buf = core_1.pb.encode({
        1: 1,
        2: 5,
        3: 9,
        4: [
            {
                2: this.uin,
                4: compressed,
                5: 2,
                6: rsp[3].toBuffer()
            }
        ]
    });
    const ip = rsp[4]?.[0] || rsp[4];
    const port = rsp[5]?.[0] || rsp[5];
    await internal_1.highwayUpload.call(this, node_stream_1.Readable.from(Buffer.from(buf), { objectMode: false }), {
        cmdid: internal_1.CmdID.MultiMsg,
        md5: (0, common_1.md5)(buf),
        size: buf.length,
        ticket: rsp[10].toBuffer()
    }, ip, port);
    return rsp[2].toString();
}
