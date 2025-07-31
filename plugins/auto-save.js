const { cmd } = require('../command');
const config = require('../config');


//SHONU X MD 🤍
//CONTACT VCARD SAVE PLUGINS 💥
//=======SUCCESS =======
//======================
//=========================

cmd({
    pattern: "csave",
    react: "💾",
    desc: "ᴀᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ sᴀᴠᴇ ᴄᴏɴᴛᴀᴄᴛ ғʀᴏᴍ ɪɴʙᴏx ᴍᴇssᴀɢᴇ ᴜsɪɴɢ ᴡʜᴀᴛsᴀᴘᴘ ᴘʀᴏғɪʟᴇ ɴᴀᴍᴇ",
    category: "utility",
    use: ".ᴄsᴀᴠᴇ",
    filename: __filename
},
async (conn, mek, m, { from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, isAdmins, reply }) => {
    try {
        // Check if the message is from a private chat (not a group)
        if (isGroup) return;

        // Get sender's profile details
        let userProfile = await conn.fetchStatus(sender).catch(() => ({ status: pushname || null }));
        let contactName = pushname || userProfile.status; // Prioritize pushname, then status
        if (!contactName) throw new Error('ɴᴏ ᴡʜᴀᴛsᴀᴘᴘ ᴘʀᴏғɪʟᴇ ɴᴀᴍᴇ ᴀᴠᴀɪʟᴀʙʟᴇ'); // Ensure profile name exists
        let phoneNumber = sender.split("@")[0]; // Extract phone number from sender ID

        // Fetch profile picture
        let profilePicUrl;
        try {
            profilePicUrl = await conn.profilePictureUrl(sender, 'image');
        } catch (e) {
            profilePicUrl = null; // Fallback if no profile picture
        }

        // Create vCard with WhatsApp profile name
        let vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName}\nTEL;type=CELL;type=VOICE;waid=${phoneNumber}:+${phoneNumber}\nEND:VCARD\n`;

        // Save vCard to file
        let nmfilect = './new_contact.vcf';
        fs.writeFileSync(nmfilect, vcard.trim());

        // Send vCard with caption
        await conn.sendMessage(from, {
            document: fs.readFileSync(nmfilect),
            mimetype: 'text/vcard',
            fileName: `${contactName}.vcf`,
            caption: `📋 *ᴄᴏɴᴛᴀᴄᴛ sᴀᴠᴇᴅ!*\nɴᴀᴍᴇ: *${contactName}*\nɴᴜᴍʙᴇʀ: *+${phoneNumber}*\n\nYo ʙʀᴏ, ɪ sᴀᴠᴇᴅ ʏᴏᴜ! sᴀᴠᴇ ᴍᴇ ᴛᴏᴏ! 😎`
        }, { ephemeralExpiration: 86400, quoted: m });

        // Send profile picture as a separate message if available
        if (profilePicUrl) {
            await conn.sendMessage(from, {
                image: { url: profilePicUrl },
                caption: `ʜᴇʀᴇ's ʏᴏᴜʀ ᴘʀᴏғɪʟᴇ ᴘɪᴄ! 😎`
            }, { ephemeralExpiration: 86400, quoted: m });
        }

        // Clean up temporary file
        fs.unlinkSync(nmfilect);

        // Send success reaction
        await conn.sendMessage(from, { react: { text: `✅`, key: mek.key } });

    } catch (e) {
        reply('*ᴏᴏᴘs, sᴏᴍᴇᴛʜɪɴɢ ᴡᴇɴᴛ ᴡʀᴏɴɢ! 😕*');
        l(e); // Log error for debugging
    }
});
