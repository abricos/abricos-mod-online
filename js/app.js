/*
@version $Id$
@copyright Copyright (C) 2008 Abricos All rights reserved.
@license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
*/

var Component = new Brick.Component();
Component.requires = { 
	mod:[{name: 'webos', files: ['os.js']}]
};
Component.entryPoint = function(){
	
	var os = Brick.mod.webos;
	
	if (Brick.Permission.check('online', '10') > 0){
		var app = new os.Application(this.moduleName);
		app.icon = '/modules/online/images/app_icon.gif';
		app.entryComponent = 'manager';
		app.entryPoint = 'Brick.mod.online.API.showOnlinePanel';
		
		os.ApplicationManager.register(app);
		
		os.ApplicationManager.startupRegister(function(){
			Brick.f('online', 'manager', 'showOnlinePanel');
		});
		
	}
	
};
