Object.defineProperty(exports, "__esModule", { value: true });
exports.sendInquiryEmails = exports.generateAutoReplyEmail = exports.generateLeadNotificationEmail = void 0;
const PROJECT_TYPE_LABELS = {
    product: 'Product design',
    system: 'Design system',
    marketing: 'Marketing website',
    app: 'App / dashboard',
    graphic: 'Graphic design',
    video: 'Video',
};
const SITE_URL = 'https://devignux.com';
const LOGO_URL = `${SITE_URL}/logo192.png`;
const escapeHtml = (value) => value.replace(/[&<>"']/g, character => {
    switch (character) {
        case '&':
            return '&amp;';
        case '<':
            return '&lt;';
        case '>':
            return '&gt;';
        case '"':
            return '&quot;';
        case "'":
            return '&#39;';
        default:
            return character;
    }
});
const formatFileSize = (bytes) => {
    if (bytes < 1024)
        return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024)
        return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
};
const formatProjectTypes = (projectTypes) => projectTypes.map(id => PROJECT_TYPE_LABELS[id]).filter(Boolean).join(', ');
const formatTimestamp = (date) => new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/New_York',
    timeZoneName: 'short',
}).format(date);
const renderFieldRow = (label, value) => `
  <tr>
    <td style="padding: 14px 0; border-bottom: 1px solid #e5e7eb;">
      <span style="display: block; color: #6b7280; font-size: 12px; line-height: 1.4; text-transform: uppercase; letter-spacing: 0.08em;">${label}</span>
      <span style="display: block; color: #111827; font-size: 15px; line-height: 1.55; margin-top: 4px;">${value}</span>
    </td>
  </tr>
`;
const generateLeadNotificationEmail = (inquiry, assets, submittedAt = new Date()) => {
    const projectTypes = formatProjectTypes(inquiry.projectTypes) || '-';
    const timestamp = formatTimestamp(submittedAt);
    const assetLines = assets.length
        ? assets.map(asset => `${asset.name} (${formatFileSize(asset.size)}): ${asset.url}`).join('\n')
        : 'No assets uploaded';
    const assetHtml = assets.length
        ? assets.map(asset => `
      <li style="margin: 0 0 10px;">
        <a href="${escapeHtml(asset.url)}" style="color: #8f5fd7; text-decoration: underline;">${escapeHtml(asset.name)}</a>
        <span style="color: #6b7280;">(${escapeHtml(formatFileSize(asset.size))})</span>
      </li>
    `).join('')
        : '<li style="color: #6b7280;">No assets uploaded</li>';
    const notes = inquiry.details || '(no notes provided)';
    const replyHref = `mailto:${encodeURIComponent(inquiry.email)}?subject=${encodeURIComponent(`Re: New Project Inquiry — ${inquiry.name}`)}`;
    return {
        subject: `New Project Inquiry — ${inquiry.name || 'New Lead'}`,
        text: [
            'New project inquiry',
            '',
            `Name: ${inquiry.name}`,
            `Email: ${inquiry.email}`,
            `Company: ${inquiry.businessName || '-'}`,
            `Website / Social: ${inquiry.website || '-'}`,
            `Project Type: ${projectTypes}`,
            `Budget: ${inquiry.budget || '-'}`,
            `Timeline: ${inquiry.timeline || '-'}`,
            `Submission timestamp: ${timestamp}`,
            '',
            'Notes / Message:',
            notes,
            '',
            'Attachment URLs (Cloudinary):',
            assetLines,
        ].join('\n'),
        html: `
      <!doctype html>
      <html lang="en">
        <body style="margin: 0; padding: 0; background: #f4f1f8; font-family: Arial, Helvetica, sans-serif; color: #111827;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f4f1f8; padding: 32px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 640px; background: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #e7e2ee;">
                  <tr>
                    <td style="padding: 30px 32px 24px; background: #0c0c0e;">
                      <div style="color: #f6f0ff; font-size: 18px; font-weight: 800; letter-spacing: 0.04em;">Devign</div>
                      <h1 style="margin: 22px 0 0; color: #ffffff; font-size: 26px; line-height: 1.2; font-weight: 700;">New project inquiry</h1>
                      <p style="margin: 10px 0 0; color: rgba(255,255,255,0.72); font-size: 14px; line-height: 1.6;">A new lead submitted the Devign UX contact form.</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 32px 4px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        ${renderFieldRow('Name', escapeHtml(inquiry.name || '-'))}
                        ${renderFieldRow('Email', `<a href="mailto:${escapeHtml(inquiry.email)}" style="color: #8f5fd7; text-decoration: underline;">${escapeHtml(inquiry.email)}</a>`)}
                        ${renderFieldRow('Company', escapeHtml(inquiry.businessName || '-'))}
                        ${renderFieldRow('Project Type', escapeHtml(projectTypes))}
                        ${renderFieldRow('Budget', escapeHtml(inquiry.budget || '-'))}
                        ${renderFieldRow('Timeline', escapeHtml(inquiry.timeline || '-'))}
                        ${renderFieldRow('Submission timestamp', escapeHtml(timestamp))}
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 22px 32px 6px;">
                      <h2 style="margin: 0 0 10px; color: #111827; font-size: 16px; line-height: 1.4;">Notes / Message</h2>
                      <div style="white-space: pre-wrap; color: #374151; font-size: 15px; line-height: 1.65; padding: 18px; background: #fafafa; border: 1px solid #ececec; border-radius: 12px;">${escapeHtml(notes)}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 22px 32px 6px;">
                      <h2 style="margin: 0 0 10px; color: #111827; font-size: 16px; line-height: 1.4;">Attachment URLs (Cloudinary)</h2>
                      <ul style="margin: 0; padding: 0 0 0 20px; color: #374151; font-size: 14px; line-height: 1.6;">${assetHtml}</ul>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 26px 32px 34px;">
                      <a href="${replyHref}" style="display: inline-block; background: #9f78d7; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; line-height: 1; padding: 15px 20px; border-radius: 999px;">Reply to ${escapeHtml(inquiry.name || 'lead')}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `.trim(),
    };
};
exports.generateLeadNotificationEmail = generateLeadNotificationEmail;
const generateAutoReplyEmail = (inquiry) => {
    const previewText = "Thanks for reaching out. We'll review your project and get back to you shortly.";
    const firstName = inquiry.name.split(/\s+/)[0] || 'there';
    return {
        subject: "We've received your project inquiry",
        text: [
            'Thank you for contacting Devign.',
            '',
            `Hi ${firstName},`,
            '',
            "We've received your inquiry and are currently reviewing the details.",
            '',
            "If your project appears to be a good fit, we'll reach out to schedule a discovery call and discuss goals, timeline, scope, and next steps.",
            '',
            'Typical response time is within 24 business hours.',
            '',
            'Jonathan Ferreira',
            'Founder, Devign UX',
            SITE_URL,
            '',
            'This email confirms that we successfully received your inquiry.',
            'No further action is required.',
        ].join('\n'),
        html: `
      <!doctype html>
      <html lang="en">
        <body style="margin: 0; padding: 0; background: #0c0c0e; font-family: Arial, Helvetica, sans-serif; color: #f8fafc;">
          <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">${previewText}</div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #0c0c0e; padding: 32px 16px;">
            <tr>
              <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 620px;">
                  <tr>
                    <td style="padding: 28px 0 20px;">
                      <a href="${SITE_URL}" style="display: inline-flex; align-items: center; text-decoration: none;">
                        <img src="${LOGO_URL}" width="34" height="34" alt="Devign logo" style="display: inline-block; border: 0; border-radius: 8px; vertical-align: middle; margin-right: 10px;" />
                        <span style="color: rgba(255,255,255,0.84); font-size: 18px; line-height: 1; font-weight: 800; letter-spacing: 0.04em; vertical-align: middle;">Devign UX</span>
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td style="background: #ffffff; color: #111827; border-radius: 20px; padding: 34px 32px; border: 1px solid rgba(255,255,255,0.14);">
                      <h1 style="margin: 0 0 18px; color: #111827; font-size: 28px; line-height: 1.18; font-weight: 700;">Thank you for contacting Devign.</h1>
                      <p style="margin: 0 0 18px; color: #374151; font-size: 16px; line-height: 1.7;">Hi ${escapeHtml(firstName)},</p>
                      <p style="margin: 0 0 18px; color: #374151; font-size: 16px; line-height: 1.7;">We've received your inquiry and are currently reviewing the details.</p>
                      <p style="margin: 0 0 18px; color: #374151; font-size: 16px; line-height: 1.7;">If your project appears to be a good fit, we'll reach out to schedule a discovery call and discuss goals, timeline, scope, and next steps.</p>
                      <p style="margin: 0 0 26px; color: #374151; font-size: 16px; line-height: 1.7;">Typical response time is within 24 business hours.</p>
                      <div style="height: 1px; background: #e5e7eb; margin: 0 0 24px;"></div>
                      <p style="margin: 0; color: #111827; font-size: 15px; line-height: 1.65;">Jonathan Ferreira<br /><span style="color: #6b7280;">Founder, Devign UX</span><br /><a href="${SITE_URL}" style="color: #8f5fd7; text-decoration: underline;">${SITE_URL}</a></p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 8px 0; color: rgba(255,255,255,0.52); font-size: 12px; line-height: 1.6; text-align: center;">
                      This email confirms that we successfully received your inquiry.<br />No further action is required.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `.trim(),
    };
};
exports.generateAutoReplyEmail = generateAutoReplyEmail;
const isRecord = (value) => typeof value === 'object' && value !== null;
const assertResendAccepted = (result) => {
    if (!isRecord(result) || !('error' in result))
        return;
    const { error } = result;
    if (error)
        throw error;
};
const sendInquiryEmails = async ({ resend, fromEmail, ownerEmail, inquiry, assets, submittedAt, }) => {
    const leadEmail = (0, exports.generateLeadNotificationEmail)(inquiry, assets, submittedAt);
    const leadResult = await resend.emails.send({
        from: fromEmail,
        to: ownerEmail,
        replyTo: inquiry.email,
        subject: leadEmail.subject,
        text: leadEmail.text,
        html: leadEmail.html,
    });
    assertResendAccepted(leadResult);
    try {
        const autoReplyEmail = (0, exports.generateAutoReplyEmail)(inquiry);
        const autoReplyResult = await resend.emails.send({
            from: fromEmail,
            to: inquiry.email,
            subject: autoReplyEmail.subject,
            text: autoReplyEmail.text,
            html: autoReplyEmail.html,
        });
        assertResendAccepted(autoReplyResult);
    }
    catch (error) {
        console.error('Auto reply failed', error);
    }
};
exports.sendInquiryEmails = sendInquiryEmails;
