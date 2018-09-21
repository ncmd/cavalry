import ReactGA from 'react-ga';

if (process.env.REACT_APP_HOST_ENV === 'local'){
  ReactGA.initialize('UA-123951173-1',{
  debug: true,
  });
} else {
  ReactGA.initialize('UA-123951173-1',{
  debug: false,
  });
}


export const Cavalry_Webapp_Submit_Runbook_Userpublishedrunbook = (runbooktitle) => {
  ReactGA.event(
      {
      label: runbooktitle,
      action: 'user published runbook',
      category: 'runbook'
    }
  );
};

export const Cavalry_Webapp_Submit_Runbook_Runbookobjectivecreated = (objectivetitle) => {
  ReactGA.event(
      {
      label: objectivetitle,
      action:'runbook objective created',
      category:'runbook'
    }
  );
};

export const Cavalry_Webapp_Login_Account_Usersignedin = (emailaddress) => {
  ReactGA.event(
      {
      label: emailaddress.substring(0, emailaddress.lastIndexOf("@"))+'-'+emailaddress.substring(emailaddress.lastIndexOf("@")+1),
      action:'user signed in',
      category:'account'
    }
  );
};

export const Cavalry_Webapp_Login_Account_Userfailedsignedin = (emailaddress) => {
  ReactGA.event(
      {
      label: emailaddress.substring(0, emailaddress.lastIndexOf("@"))+'-'+emailaddress.substring(emailaddress.lastIndexOf("@")+1),
      action:'user failed signed in',
      category:'account'
    }
  );
};

export const Cavalry_Webapp_Signup_Account_Useraccountcreated = (emailaddress) => {
  ReactGA.event(
      {
      label: emailaddress.substring(0, emailaddress.lastIndexOf("@"))+'-'+emailaddress.substring(emailaddress.lastIndexOf("@")+1),
      action:'user created account',
      category:'account'
    }
  );
};

export const Cavalry_Webapp_Signup_Signup_Userselectedplan = (selectedplan) => {
  ReactGA.event(
      {
      label: selectedplan,
      action:'user selected plan',
      category:'signup'
    }
  );
};

export const Cavalry_Webapp_Signup_Signup_Userclickedrecaptcha = (emailaddress) => {
  ReactGA.event(
      {
      label: emailaddress.substring(0, emailaddress.lastIndexOf("@"))+'-'+emailaddress.substring(emailaddress.lastIndexOf("@")+1),
      action:'user clicked recaptcha',
      category:'signup'
    }
  );
};

export const Cavalry_Webapp_Signup_Signup_Userclickedpaybutton = (emailaddress) => {
  ReactGA.event(
      {
      label: emailaddress.substring(0, emailaddress.lastIndexOf("@"))+'-'+emailaddress.substring(emailaddress.lastIndexOf("@")+1),
      action:'user clicked pay button',
      category:'signup'
    }
  );
};

export const Cavalry_Webapp_Header_Header_Userclickedhomebutton = () => {
  ReactGA.event(
      {
      label: 'home button',
      action:'user clicked home button',
      category:'header'
    }
  );
};

export const Cavalry_Webapp_Header_Header_Userclickedloginbutton = () => {
  ReactGA.event(
      {
      label: 'login button',
      action:'user clicked login button',
      category:'header'
    }
  );
};

export const Cavalry_Webapp_Header_Header_Userclickedsignupbutton = () => {
  ReactGA.event(
      {
      label: 'signup button',
      action:'user clicked signup button',
      category:'header'
    }
  );
};

export const Cavalry_Webapp_Header_Header_Userclickedpostbutton = () => {
  ReactGA.event(
      {
      label: 'post button',
      action:'user clicked post button',
      category:'header'
    }
  );
};

export const Cavalry_Webapp_Header_Header_Userclickedrequestbutton = () => {
  ReactGA.event(
      {
      label: 'request button',
      action:'user clicked request button',
      category:'header'
    }
  );
};

export const Cavalry_Webapp_Header_Header_Userclickedmanagebutton = () => {
  ReactGA.event(
      {
      label: 'manage button',
      action:'user clicked manage button',
      category:'header'
    }
  );
};

export const Cavalry_Webapp_Header_Header_Userclickedaccountbutton = (userid) => {
  ReactGA.event(
      {
      label: userid,
      action:'user clicked account button',
      category:'header'
    }
  );
};

export const Cavalry_Webapp_Header_Header_Userclickedsignoutbutton = (userid) => {
  ReactGA.event(
      {
      label: userid,
      action:'user clicked signout button',
      category:'header'
    }
  );
};

export const Cavalry_Webapp_Landing_Runbook_Userclickedonrunbook = (runbooktitle) => {
  ReactGA.event(
      {
      label: runbooktitle,
      action:'user clicked on runbook',
      category:'runbook'
    }
  );
};
