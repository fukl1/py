const { cmd } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;

cmd({
    pattern: "invite",
    alias: ["link", "grouplink"],
    desc: "Get group invite link.",
    category: "group",
    filename: __filename,
}, async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) {
            return reply("❌ *This command only works in group chats.*");
        }

        const groupMetadata = await conn.groupMetadata(from);
        const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
        const isBotAdmin = groupMetadata.participants.some(p => p.id === botNumber && p.admin);

        if (!isBotAdmin) {
            return reply("⚠️ *ɪ ɴᴇᴇᴅ ᴛᴏ ʙᴇ ᴀɴ ᴀᴅᴍɪɴ ᴛᴏ ɢᴇᴛ ᴛʜᴇ ɢʀᴏᴜᴘ ɪɴᴠɪᴛᴇ ʟɪɴᴋ.*");
        }

        const code = await conn.groupInviteCode(from);
        if (!code) return reply("❌ *Failed to retrieve group invite code.*");

        const inviteLink = `https://chat.whatsapp.com/${code}`;
        return reply(`🔗 *ɢʀᴏᴜᴘ ɪɴᴠɪᴛᴇ ʟɪɴᴋ:*\n${inviteLink}`);

    } catch (err) {
        console.error("Invite error:", err);
        return reply(`❌ *Error:* ${err.message || "Unknown error"}`);
    }
});
