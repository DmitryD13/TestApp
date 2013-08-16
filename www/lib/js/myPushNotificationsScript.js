document.addEventListener('deviceready', onDeviceReady, false);
            
            function onDeviceReady() {
            	//$("#app-status-ul").append('<li>deviceready event received</li>');
            	//$("#app-status-ul").append('<li>Das ist separater Skript</li>');
            	
                /* backbutton event is commented out
                document.addEventListener("backbutton", function(e)
				{
                	$("#app-status-ul").append('<li>backbutton event received</li>');
  					
      				if( $("#home").length > 0)
					{
						// call this to get a new token each time. don't call it to reuse existing token.
						pushNotification.unregister(successHandler, errorHandler);
						e.preventDefault();
						navigator.app.exitApp();
					}
					else
					{
						navigator.app.backHistory();
					}
				}, false);
				*/
			
				try 
				{ 
                	var pushNotification;
            		pushNotification = window.plugins.pushNotification;
            		
            		if (device.platform == 'android' || device.platform == 'Android') {
            		    //&& window.localStorage.getItem("RegID") == null
						//$("#app-status-ul").append('<li>registering android</li>');
						pushNotification.register(successHandler, errorHandler, { "senderID": "775482793381", "ecb": "onNotificationGCM" });		// required!                    
					} else {
						/*$("#app-status-ul").append('<li>registering iOS</li>');*/
                    	pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});	// required!
                	}             	
                }
				catch(err) 
				{ 
					txt="There was an error on this page.\n\n"; 
					txt+="Error description: " + err.message + "\n\n"; 
					alert(txt); 
					console.log(txt);
				}

				if (window.localStorage.getItem("ItemID") != null) {
				    getItemWithID(window.localStorage.getItem("ItemID"));
				    window.localStorage.removeItem("ItemID");
				}
				else {
				}
            }
            
            // handle APNS notifications for iOS
            function onNotificationAPN(e) {
                if (e.alert) {
                     /*$("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');*/
                     navigator.notification.alert(e.alert);
                }
                    
                if (e.sound) {
                    var snd = new Media(e.sound);
                    snd.play();
                }
                
                if (e.badge) {
                    pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
                }
            }
            
            function tokenHandler (result) {
                /*$("#app-status-ul").append('<li>token: '+ result +'</li>');*/
                // Your iOS push server needs to know the token before it can push to this device
                // here is where you might want to send the token for later use.
            }
            
            // handle GCM notifications for Android
            function onNotificationGCM(e) {
            	//$("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');
                
                switch( e.event )
                {
                    case 'registered':
					if ( e.regid.length > 0 )
					{
						//$("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
						// Your GCM push server needs to know the regID before it can push to this device
					    // here is where you might want to send it the regID for later use.
					    //navigator.notification.alert("Registration ID: " + e.regid);
					    //window.localStorage.setItem("RegID", e.regid);
						console.log("regID = " + e.regid);
					}
                    break;
                    
                    case 'message':

                        // if this flag is set, this notification happened while we were in the foreground.
                    	// you might want to play a sound to get the user's attention, throw up a dialog, etc.
                    	if (e.foreground)
                    	{
							//$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
                    	    console.log("--INLINE NOTIFICATION--");
                    	    //// Show message with options to cancel and continue
                    	    //var dialogue = confirm(e.message + "\nMoechten Sie die Positionsdetails anschauen?");
                    	    //if (dialogue == true) {
                    	    //    var Item = document.getElementById(e.msgcnt);
                    	    //    getItem(Item);
                    	    //}
                    	    //else {
                            //    // do nothing
                    	    //}

                    	    notificationDialogue(e);

							// if the notification contains a soundname, play it.
							var my_media = new Media("/android_asset/www/lib/audio/"+e.soundname);
							my_media.play();
						}
						else
						{	// otherwise we were launched because the user touched a notification in the notification tray.

                    	    // Save msgcnt parameter in the local storage
                    	    window.localStorage.setItem("ItemID", e.msgcnt);

                    	    if (e.coldstart) {
                    	        console.log("--COLDSTART NOTIFICATION--");                    	        
                    	        //$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                    	    }
                    	    else {
                    	        console.log("--BACKGROUND NOTIFICATION--");
                    	        //$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                    	    }
						}
							
						//$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
						//$("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
                    break;
                    
                    case 'error':
						//$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
                    break;
                    
                    default:
						//$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                    break;
                }
            }
            
            function successHandler (result) {
            	//$("#app-status-ul").append('<li>success:'+ result +'</li>');
            }
            
            function errorHandler (error) {
            	//$("#app-status-ul").append('<li>error:'+ error +'</li>');
            }

            function notificationDialogue(notification)
            {
                // Show message with options to cancel and confirm
                var dialogue = confirm(notification.message + "\nMoechten Sie die Positionsdetails anschauen?");
                if (dialogue == true) {
                    getItemWithID(notification.msgcnt);
                }
                else {
                    // do nothing
                }
            }

            // When the app is resumed...
            document.addEventListener("resume", onResume, false);
            function onResume()
            {
                if (window.localStorage.getItem("ItemID") != 0) {
                    getItemWithID(window.localStorage.getItem("ItemID"));
                    window.localStorage.removeItem("ItemID");
                }
                else
                {
                    // Do nothing
                }                
            }