function isValidEmail(email) {
  var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}


function sendEmailNotif(type, recipient, pname, timestamp){


  link_web = "https://www.savecantonese.org/";
  link_sheet = "SaveCanto Google Sheets Link";
  link_form = "https://docs.google.com/forms/d/e/1FAIpQLSe8ux3_RBDXN9ThKjNMsNQ4mCYppMU3iMXnQYActGvDohoFvg/viewform?usp=preview";
  reason = "Due to, reason for not approving? website down, etc?.";


  if (!type || !timestamp || !pname || !recipient || !isValidEmail(recipient)) {return;}
 
  switch (type) {
    case "Submission":
      header = "[ACTION REQUIRED]: New Program Submission for Review";
      content = "📣 A new program has been submitted and is awaiting your review!\n\nProgram Details:\n\n- Title: "+pname+"\n- Submitted by: "+recipient+"\n- Date Submitted: "+timestamp+"\n\nPlease review the submission and update its status once a decision has been made. You can view the submission here: [Link to Google Sheets]\n\nThis is an automated message. Please do not reply directly to this email.";
      break;
    case "Approval":
      header = "Your Program “"+pname+"” Has Been Approved!";
      content = "Dear "+recipient+",\n\nWe’re pleased to inform you that your program, "+pname+", has been approved! 🥳 \n\nThank you for your submission! We’re excited to feature you on our map for others to discover and join. You can view your submission on our website here: "+link_web+".\n\nBest,\n\nSave Cantonese\n\nThis is an automated message. Please do not reply directly to this email."
      break;
    case "Rejection":
      header = "Update on Your Program Submission – “"+pname+"”"
      content = "Dear "+recipient+",\n\nThank you for submitting your program, "+pname+". After careful review, we’re sorry to inform you that your submission was not approved at this time.\n\n" + reason + " You’re welcome to revise and resubmit your program any time at this link: "+link_sheet+".\n\nIf you have any questions about the decision, feel free to contact us at [savecanto org email].\n\nBest,\n\nSave Cantonese"
      break;
    default:
      header = null;
      content = null;
  }


  if (header && content) {
    MailApp.sendEmail({
      to: recipient,
      subject: header,
      body: content
    });
    Logger.log("Email sent to " + recipient);
  }
}