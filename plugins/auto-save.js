const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs'); // <-- Manquait ici

cmd({
    pattern: "csave",
    react: "💾",
    desc: "ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ sᴀᴠᴇ ᴄᴏɴᴛᴀᴄᴛ ғʀᴏᴍ ɪɴʙᴏx ᴍᴇssᴀɢᴇ ᴜsɪɴɢ ᴡʜᴀᴛsᴀᴘᴘ ᴘʀᴏғɪʟᴇ ɴᴀᴍᴇ",
    category: "utility",
    use: ".csave",
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isAdmins, reply }) => {
    try {
        if (isGroup) return reply("❌ ᴛʜɪs ᴄᴏᴍᴍᴀɴᴅ ᴏɴʟʏ ᴡᴏʀᴋs ɪɴ ᴘʀɪᴠᴀᴛᴇ ᴄʜᴀᴛ!");

        // Get sender's profile name
        let userProfile = await conn.fetchStatus(sender).catch(() => ({ status: pushname || null }));
        let contactName = pushname || userProfile.status;
        if (!contactName) throw new Error('No profile name found!');
        let phoneNumber = sender.split("@")[0];

        // Try to get profile picture
        let profilePicUrl;
        try {
            profilePicUrl = await conn.profilePictureUrl(sender, 'image');
        } catch {
            profilePicUrl = null;
        }

        // Create vCard content
        let vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName}\nTEL;type=CELL;type=VOICE;waid=${phoneNumber}:+${phoneNumber}\nEND:VCARD\n`;

        // Save vCard to file
        let filename = './new_contact.vcf';
        fs.writeFileSync(filename, vcard.trim());

        // Send the contact file
        await conn.sendMessage(from, {
            document: fs.readFileSync(filename),
            mimetype: 'text/vcard',
            fileName: `${contactName}.vcf`,
            caption: `📋 *ᴄᴏɴᴛᴀᴄᴛ sᴀᴠᴇᴅ!*\nɴᴀᴍᴇ: *${contactName}*\nɴᴜᴍʙᴇʀ: *+${phoneNumber}*\n\nʏᴏ ʙʀᴏ, ɪ sᴀᴠᴇᴅ ʏᴏᴜ! sᴀᴠᴇ ᴍᴇ ᴛᴏᴏ 😎`
        }, { quoted: m });

        // Send profile picture
        if (profilePicUrl) {
            await conn.sendMessage(from, {
                image: { url: profilePicUrl },
                caption: `ʜᴇʀᴇ’s ʏᴏᴜʀ ᴘʀᴏғɪʟᴇ ᴘɪᴄ 😎`
            }, { quoted: m });
        }

        fs.unlinkSync(filename); // Remove the temporary file
        await conn.sendMessage(from, { react: { text: `✅`, key: mek.key } });

    } catch (e) {
        reply('*ᴏᴏᴘs, sᴏᴍᴇᴛʜɪɴɢ ᴡᴇɴᴛ ᴡʀᴏɴɢ!* 😕');
        l(e);
    }
});
