const { cmd } = require('../command');

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

        const metadata = await conn.groupMetadata(from);
        const botJid = conn.user.id.includes(":") ? conn.user.id.split(":")[0] + "@s.whatsapp.net" : conn.user.id;
        const isBotAdmin = metadata.participants.some(p => p.id === botJid && (p.admin === 'admin' || p.admin === 'superadmin'));

        if (!isBotAdmin) {
            return reply("⚠️ *I need to be an admin to get the group invite link.*");
        }

        const code = await conn.groupInviteCode(from);
        if (!code) return reply("❌ *Failed to retrieve group invite code.*");

        const inviteLink = `https://chat.whatsapp.com/${code}`;
        return reply(`🔗 *Group Invite Link:*\n${inviteLink}`);

    } catch (err) {
        console.error("Invite error:", err);
        return reply(`❌ *Error:* ${err.message || "Unknown error"}`);
    }
});
