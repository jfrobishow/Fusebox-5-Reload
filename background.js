/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

/*
Called when there was an error.
We'll just log the error here.
*/
function onError(error) {
  console.log(`Error: ${error}`);
}

/*Create all the context menu items we will need to reload fusebox with all the possible options*/

//LOAD
browser.menus.create({
  id: "load",
  title: browser.i18n.getMessage("load"),
  contexts: ["all"]
}, onCreated);
  //LOAD PARSE
  browser.menus.create({
    id: "load-parse",
    title: browser.i18n.getMessage("parse"),
    contexts: ["all"],
    parentId: "load"
  }, onCreated);
    //LOAD PARSE {EXECUTE}
    browser.menus.create({
      id: "load-parse-execute",
      title: browser.i18n.getMessage("execute"),
      contexts: ["all"],
      parentId: "load-parse"
    }, onCreated);
    browser.menus.create({
      id: "load-parse-no-execute",
      title: browser.i18n.getMessage("dontExecute"),
      contexts: ["all"],
      parentId: "load-parse"
    }, onCreated);
  //LOAD DONT PARSE
  browser.menus.create({
    id: "load-no-parse",
    title: browser.i18n.getMessage("dontParse"),
    contexts: ["all"],
    parentId: "load"
  }, onCreated);
    //LOAD DONT PARSE {EXECUTE}
    browser.menus.create({
      id: "load-no-parse-execute",
      title: browser.i18n.getMessage("execute"),
      contexts: ["all"],
      parentId: "load-no-parse"
    }, onCreated);
    browser.menus.create({
      id: "load-no-parse-no-execute",
      title: browser.i18n.getMessage("dontExecute"),
      contexts: ["all"],
      parentId: "load-no-parse"
    }, onCreated);

browser.menus.create({
  id: "separator-1",
  type: "separator",
  contexts: ["all"]
}, onCreated);

//LOAD CLEAN
browser.menus.create({
  id: "load-clean",
  title: browser.i18n.getMessage("loadClean"),
  contexts: ["all"]
}, onCreated);
  //LOAD CLEAN PARSEALL
  browser.menus.create({
    id: "load-clean-parseall",
    title: browser.i18n.getMessage("parseAll"),
    contexts: ["all"],
    parentId: "load-clean"
  }, onCreated);
    //LOAD CLEAN PARSEALL {EXECUTE}
    browser.menus.create({
      id: "load-clean-parseall-execute",
      title: browser.i18n.getMessage("execute"),
      contexts: ["all"],
      parentId: "load-clean-parseall"
    }, onCreated);
    browser.menus.create({
      id: "load-clean-parseall-no-execute",
      title: browser.i18n.getMessage("dontExecute"),
      contexts: ["all"],
      parentId: "load-clean-parseall"
    }, onCreated);
  //LOAD CLEAN DONT PARSEALL
  browser.menus.create({
    id: "load-clean-no-parseall",
    title: browser.i18n.getMessage("dontParseAll"),
    contexts: ["all"],
    parentId: "load-clean"
  }, onCreated);
    //LOAD CLEAN DONT PARSEALL {EXECUTE}
    browser.menus.create({
      id: "load-clean-no-parseall-execute",
      title: browser.i18n.getMessage("execute"),
      contexts: ["all"],
      parentId: "load-clean-no-parseall"
    }, onCreated);
    browser.menus.create({
      id: "load-clean-no-parseall-no-execute",
      title: browser.i18n.getMessage("dontExecute"),
      contexts: ["all"],
      parentId: "load-clean-no-parseall"
    }, onCreated);

browser.menus.create({
  id: "separator-2",
  type: "separator",
  contexts: ["all"]
}, onCreated);

//PARSE ALL
browser.menus.create({
  id: "parse-all",
  title: browser.i18n.getMessage("parseAll"),
  contexts: ["all"]
}, onCreated);
  //PARSE ALL {EXECUTE}
  browser.menus.create({
    id: "parse-all-execute",
    title: browser.i18n.getMessage("execute"),
    contexts: ["all"],
    parentId: "parse-all"
  }, onCreated);
  browser.menus.create({
    id: "parse-all-no-execute",
    title: browser.i18n.getMessage("dontExecute"),
    contexts: ["all"],
    parentId: "parse-all"
  }, onCreated);

/*
The click event listener, where we perform the appropriate action given the
ID of the menu item that was clicked.
*/
browser.menus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {

    /*Load*/
    case "load-parse-execute":
      parseFusebox({load:true, parse:true, execute:true});
      break;
    case "load-parse-no-execute":
      parseFusebox({load:true, parse:true, execute:false});
      break;
    case "load-no-parse-execute":
      parseFusebox({load:true, parse:false, execute:true});
      break;
    case "load-no-parse-no-execute":
      parseFusebox({load:true, parse:false, execute:false});
      break;

    /*Load clean*/
    case "load-clean-parseall-execute":
      parseFusebox({loadclean:true, parseall:true, execute:true});
      break;
    case "load-clean-parseall-no-execute":
      parseFusebox({loadclean:true, parseall:true, execute:false});
      break;
    case "load-clean-no-parseall-execute":
      parseFusebox({loadclean:true, parseall:false, execute:true});
      break;
    case "load-clean-no-parseall-no-execute":
      parseFusebox({loadclean:true, parseall:false, execute:false});
      break;

    //Parse all
    case "parse-all-execute":
      parseFusebox({loadclean:true, parseall:true, execute:true});
      break;
    case "parse-all-no-execute":
      parseFusebox({loadclean:true, parseall:true, execute:false});
      break;
  }
});

function parseFusebox(options = {}){
  //Get the current browser window and active tab
  browser.tabs.query( {currentWindow: true, active: true} )
  .then(
    function(tabs){
      let tab = tabs[0]; //There can only be one {currentWindow, active}
      let url = tab.url.split("#")[0]; //don't keep hash if present

      //Get the settings from local storage
      browser.storage.local.get()
      .then(
        function(settings){
          options.password=settings.password || "";
          let password = settings.password || ""; //framework password set by the user
          let introduceParamsWithPrefix = (url.indexOf('?') === -1) ? '?' : '&'; //first variable on query string or not?

          let fuseboxParams =
            Object
              .keys(options)
              .map(key => `${"fusebox."+key}=${options[key]}`)
              .join("&")
            ;

          //reload the current tab with the chosen fusebox options
          let updating = browser.tabs.update({url: url+introduceParamsWithPrefix+fuseboxParams});
        }
        , onError
      );
    },
    onError
  );
}