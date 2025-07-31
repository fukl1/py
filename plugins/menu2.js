const config = require('../config')
const { cmd, commands } = require('../command')
const { runtime } = require('../lib/functions')



cmd({
    pattern: "showmenu",
    hidden: true
}, async (conn, mek, m, { args, from }) => {
    const category = args[0];
    const cmdsInCat = commands.filter(cmd => cmd.category === category);
    if (!cmdsInCat.length) {
        return conn.sendMessage(from, { text: `❌ ɴᴏ ᴄᴏᴍᴍᴀɴᴅs ғᴏᴜɴᴅ ɪɴ '${category}'` }, { quoted: m });
    }
    let text = `📂 *ᴄᴏᴍᴍᴀɴᴅs ɪɴ ${category.toUpperCase()}*\n\n`;
    for (const cmd of cmdsInCat) {
        text += `➤ ${cmd.pattern}\n`;
    }
    await conn.sendMessage(from, { text }, { quoted: m });
});

// Button menu command
cmd({
    pattern: "bn",
    desc: "Show smart button menu",
    category: "tools",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    const picUrl = "https://files.catbox.moe/w1l8b0.jpg";
    const filtered = commands.filter(cmd => !["menu", "xbot", "misc"].includes(cmd.category));
    const categories = [...new Set(filtered.map(cmd => cmd.category))];
    
    const sections = categories.map((cat, index) => {
        const section = {
            rows: [
                {
                    header: 'Menu',
                    title: cat.charAt(0).toUpperCase() + cat.slice(1),
                    description: `ᴛʜɪs ғᴏʀ ${cat.charAt(0).toLowerCase() + cat.slice(1)} ᴄᴏᴍᴍᴀɴᴅs`,
                    buttonid: `${prefix}showmenu ${categories}`
                }
            ]
        };
        if (index === 0) {
            section.title = "sᴇʟᴇᴄᴛ ᴀ ᴍᴇɴᴜ";
            section.highlight_label = '𝐦𝐨𝐝𝐞𝐫𝐚𝐭𝐢𝐨𝐧 𝐦𝐞𝐧𝐮';
        }
        return section;
    });

    // Handle button text if it exists
    const buttonText = m.text?.toLowerCase();
    if (buttonText === `${prefix}Ping` || buttonText === `${prefix}ping`) {
        const start = new Date().getTime();
        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];
        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }
        await conn.sendMessage(from, { react: { text: textEmoji, key: mek.key } });
        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;
        const text = `> *MEGALODON-MD SPEED: ${responseTime.toFixed(2)}ᴍs ${reactionEmoji}*`;
        return await conn.sendMessage(from, { text: text }, { quoted: mek });
    }

    if (buttonText === "Alive" || buttonText === `${prefix}alive`) {
        return await conn.sendMessage(from, { text: "*✅ ɪ ᴀᴍ ᴀʟɪᴠᴇ ᴀɴᴅ ʀᴇᴀᴅʏ ᴛᴏ sᴇʀᴠᴇ ʏᴏᴜ!*" }, { quoted: mek });
    }

    // Send button menu
    await conn.sendMessage(from, {
        image: { url: picUrl },
        caption: "📋 *ᴍᴀɪɴ ᴍᴇɴᴜ*\n\nSelect ᴀ ᴄᴀᴛᴇɢᴏʀʏ ғʀᴏᴍ ᴛʜᴇ ᴍᴇɴᴜ ʙᴇʟᴏᴡ.",
        footer: "> ɴᴇᴡ ᴍᴇɴᴜ - 2025",
        buttons: [
            {
                buttonId: `${prefix}ping`,
                buttonText: { displayText: 'PING' },
                type: 1
            },
            {
                buttonId: `${prefix}alive`,
                buttonText: { displayText: 'ALIVE' },
                type: 1
            },
            {
                buttonId: `${prefix}uptime`,
                buttonText: { displayText: '📋 sʜᴏᴡ ᴄᴀᴛᴇɢᴏʀɪᴇs' },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: 'sᴇʟᴇᴄᴛ ᴍᴇɴᴜ',
                        sections: sections
                    })
                }
            }
        ],
        headerType: 4,
        viewOnce: true
    }, { quoted: m });
});
