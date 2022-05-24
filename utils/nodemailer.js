const nodemailer = require('nodemailer');
const config = require("../config/config");

module.exports.sendMail = async function (payload) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'cfanint222test@gmail.com',
            pass: config.mail_pass
        }
    });

    let info = await transporter.sendMail({
        from: '"JaiD" <cfanint222test@gmail.com>', 
        to: payload.email, 
        subject: 'ยืนยันที่อยู่อีเมลกับ JaiD', 
        text: `ยืนยันที่อยู่อีเมลกับ JaiD กรุณากดยืนยันตัวตนของคุณเพื่อเริ่มต้นใช้งานอีเมลนี้กับ account ของคุณ ${config.front_url +"/confirmEmail?token="+ payload.jwt}`,
        attachments: [{
            filename: 'Logo.png',
            path: __dirname + '/Logo.png',
            cid: 'logo'
        }],
        html: `<div class="">
        <div class="aHl">&nbsp;</div>
        <div id=":10c" tabindex="-1">&nbsp;</div>
        <div id=":101" class="ii gt">
            <div id=":100" class="a3s aiL msg930328152788168046"><u></u>
                <div style="background: #f9f9f9;">
                    <div style="background-color: #f9f9f9;">
                        <div style="margin: 0px auto; max-width: 640px; background: transparent;">
                            <table style="font-size: 0px; width: 100%; background: transparent;" role="presentation"
                                border="0" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td
                                            style="text-align: center; vertical-align: top; direction: ltr; font-size: 0px; padding: 40px 0px;">
                                            <div class="m_930328152788168046mj-column-per-100"
                                                style="vertical-align: top; display: inline-block; direction: ltr; font-size: 13px; text-align: left; width: 100%;"
                                                aria-labelledby="mj-column-per-100">
                                                <table role="presentation" border="0" width="100%" cellspacing="0"
                                                    cellpadding="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="word-break: break-word; font-size: 0px; padding: 0px;"
                                                                align="center">
                                                                <table
                                                                    style="border-collapse: collapse; border-spacing: 0px;"
                                                                    role="presentation" border="0" cellspacing="0"
                                                                    cellpadding="0" align="center">
                                                                    <tbody>
                                                                        <tr>
                                                                            <td style="width: 138px;"><a href="${config.front_url}"
                                                                                    target="_blank" rel="noopener"><img
                                                                                        class="CToWUd" title="" src="cid:logo"
                                                                                        alt="" height="38px" /></a></td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div style="max-width: 640px; margin: 0 auto; border-radius: 4px; overflow: hidden;">
                            <div style="margin: 0px auto; max-width: 640px; background: #ffffff;">
                                <table style="font-size: 0px; width: 100%; background: #ffffff;" role="presentation"
                                    border="0" cellspacing="0" cellpadding="0" align="center">
                                    <tbody>
                                        <tr>
                                            <td
                                                style="text-align: center; vertical-align: top; direction: ltr; font-size: 0px; padding: 40px 50px;">
                                                <div class="m_930328152788168046mj-column-per-100"
                                                    style="vertical-align: top; display: inline-block; direction: ltr; font-size: 13px; text-align: left; width: 100%;"
                                                    aria-labelledby="mj-column-per-100">
                                                    <table role="presentation" border="0" width="100%" cellspacing="0"
                                                        cellpadding="0">
                                                        <tbody>
                                                            <tr>
                                                                <td style="word-break: break-word; font-size: 0px; padding: 0px;"
                                                                    align="left">
                                                                    <div
                                                                        style="color: #737f8d; font-family: Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif; font-size: 16px; line-height: 24px; text-align: left;">
                                                                        <h2
                                                                            style="font-family: Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif; font-weight: 500; font-size: 20px; color: #4f545c; letter-spacing: 0.27px;">
                                                                            สวัสดี ${payload.username},</h2>
                                                                        <p>ขอบคุณที่ลงทะเบียนบัญชีกับ JaiD ด้วยอีเมล <a
                                                                                href="${payload.email}"
                                                                                style="color: #5CB5E8;">${payload.email}</a>
                                                                            ก่อนอื่นกรุณากดยืนยันตัวตนของคุณเพื่อเริ่มต้นใช้งานอีเมลนี้กับ
                                                                            account ของคุณ
                                                                            คลิกข้างใต้เพื่อยืนยันที่อยู่อีเมลของคุณ :
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break: break-word; font-size: 0px; padding: 10px 25px; padding-top: 20px; padding-bottom: 30px;"
                                                                    align="center">
                                                                    <table style="border-collapse: separate;"
                                                                        role="presentation" border="0" cellspacing="0"
                                                                        cellpadding="0" align="center">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td style="border: none; border-radius: 12px; color: white; padding: 15px 19px; background: linear-gradient(109.13deg, #81CBF2 2.75%, #54B4EB 100%);box-shadow: 8px 8px 10px 0px #74C6F580;"
                                                                                    align="center" valign="middle"
                                                                                    bgcolor="#7289DA"><a
                                                                                        style="text-decoration: none; line-height: 100%;  color: white; font-family: Ubuntu,Helvetica,Arial,sans-serif; font-size: 15px; font-weight: normal; text-transform: none; margin: 0px;"
                                                                                        href=" ${config.front_url +"/confirmEmail?token="+ payload.jwt}" target="_blank"
                                                                                        rel="noopener">
                                                                                        ยืนยันอีเมล </a></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="word-break: break-word; font-size: 0px; padding: 10px 0px; border-top: 1px  solid #ACB5BD;">
                                                                    &nbsp;</td>
                                                            </tr>
                                                            <tr>

                                                                <td style="word-break: break-word; font-size: 0px; "
                                                                    align="left">
                                                                    <div
                                                                        style="color: #747f8d; font-family: Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif; font-size: 13px; line-height: 16px; text-align: left;">
                                                                        <p>หากต้องการความช่วนเหลืออื่นๆ <a href="${config.front_url}"
                                                                                style="color: #5CB5E8; text-decoration: none;">ติดต่อทีมช่วยเหลือของเรา</a>
                                                                            และ หากอยากส่งคำติชมต่างๆให้เรา
                                                                            โปรดแสดงความคิดเห็นให้เราทราบได้ที่ <a
                                                                                href="${config.front_url}"
                                                                                style="color: #5CB5E8; text-decoration: none;">เว็บไซต์คำติชมของเรา</a>
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div style="margin: 0px auto; max-width: 640px; background: transparent;">
                            <table style="font-size: 0px; width: 100%; background: transparent;" role="presentation"
                                border="0" cellspacing="0" cellpadding="0" align="center">
                                <tbody>
                                    <tr>
                                        <td
                                            style="text-align: center; vertical-align: top; direction: ltr; font-size: 0px; padding: 20px 0px;">
                                            <div class="m_930328152788168046mj-column-per-100"
                                                style="vertical-align: top; display: inline-block; direction: ltr; font-size: 13px; text-align: left; width: 100%;"
                                                aria-labelledby="mj-column-per-100">
                                                <table role="presentation" border="0" width="100%" cellspacing="0"
                                                    cellpadding="0">
                                                    <tbody>
                                                        <tr>
                                                            <td style="word-break: break-word; font-size: 0px; padding: 0px;"
                                                                align="center">
                                                                <div
                                                                    style="color: #99aab5; font-family: Whitney,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif; font-size: 12px; line-height: 24px; text-align: center;">
                                                                    ส่งโดย JaiD <a href="${config.front_url}"
                                                                        style="color: #5CB5E8; text-decoration: none;">เยี่ยมชมเว็บบล็อคของเรา</a><br>
                                                                    อีเมล : uso@kmutt.ac.th<br>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="yj6qo">&nbsp;</div>
                    <div class="adL">&nbsp;</div>
                </div>
                <div class="adL">&nbsp;</div>
            </div>
        </div>
        <div id=":10g" class="ii gt" style="display: none;">&nbsp;</div>
        <div class="hi">&nbsp;</div>
    </div>`
    });

    return info
    
};