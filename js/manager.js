/*
@version $Id$
@package Abricos
@copyright Copyright (C) 2008 Abricos All rights reserved.
@license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
*/

var Component = new Brick.Component();
Component.requires = {
	yahoo: ['dom'],
	mod:[
		{name: 'sys', files: ['data.js', 'container.js']},
        {name: 'online', files: ['roles.js']}
	]
};
Component.entryPoint = function(){
	
	var Dom = YAHOO.util.Dom,
		E = YAHOO.util.Event,
		L = YAHOO.lang;
	
	var NS = this.namespace, 
		TMG = this.template,
		API = NS.API;

	if (!NS.data){
		NS.data = new Brick.util.data.byid.DataSet('online');
	}
	
	Brick.util.CSS.update(Brick.util.CSS['online']['manager']);
	
	var buildTemplate = function(w, templates){
		var TM = TMG.build(templates), T = TM.data, TId = TM.idManager;
		w._TM = TM; w._T = T; w._TId = TId;
	};
	var buildTemplatePrivate = function(w, templates){
		var TM = TMG.build(templates), T = TM.data, TId = TM.idManager;
		w._pTM = TM; w._pT = T; w._pTId = TId;
	};
	
	var cnt = 0;
	var find = function(el, className, cnt){
		if (Dom.hasClass(el, className)){ return el; }
		cnt = (cnt || 0)+1;
		if (L.isNull(el) || el.parentNode == document.body || cnt > 15){
			return null;
		}
		return find(el.parentNode, className);
	};
	
	var OnlineElement = function(modname, name, config){
		config = L.merge({
			'title': '',
			'refreshVisible': true,
			'bodyVisible': true
		}, config || {});
		this.init(modname, name, config);
	};
	OnlineElement.prototype = {
		init: function(modname, name, config){
			this.modname = modname;
			this.name = name;
			this.id = modname+'-'+name;
			this.cfg = config;
			
			buildTemplatePrivate(this, 'row');
		},
		getEl: function(name){ return this._pTM.getEl('row.'+name); },
		getHTML: function(){
			return this._pTM.replace('row', {
				'title': this.cfg['title'],
				'id': this.id
			});
		},
		getContainer: function(){ return this.getEl('id'); },
		getBody: function(){ return this._pTM.getEl('row.bd'); },
		getHeader: function(){ return this._pTM.getEl('row.hd'); },
		getTitle: function(){ return this._pTM.getEl('row.tl'); },
		getTitleValue: function(){ return this.getTitle().innerHTML; },
		setTitleValue: function(value){ this.getTitle().innerHTML = value; },
		
		onLoad: function(){},
		onClick: function(el){},
		destroy: function(){},
		refresh: function(){},
		
		showWait: function(){
			this.getEl('brefresh').style.display = 'none';
			this.getEl('wait').style.display = '';
		},
		hideWait: function(){
			this.getEl('brefresh').style.display = '';
			this.getEl('wait').style.display = 'none';
		},
		
		bodyVisibleChange: function(){
			var vsb = this.cfg.bodyVisible;
			vsb ?  this.hideBody() : this.showBody();
			
			this.cfg.bodyVisible = !this.cfg.bodyVisible;
		},
		hideBody: function(){
			this.getBody().style.display = 'none';
			Dom.replaceClass(this.getHeader(), 'online-row-hshow', 'online-row-hhide');
			this.getEl('refresh').style.display = 'none';
		},
		showBody: function(){
			this.getBody().style.display = '';
			Dom.replaceClass(this.getHeader(), 'online-row-hhide', 'online-row-hshow');
			if (this.cfg.refreshVisible){
				this.getEl('refresh').style.display = '';
			}
		},
		
		pOnClick: function(el){
			if (this.onClick(el)){ return true;}
			
			var tp = this._pTId['row'];
			switch(el.id){
			case tp['brefresh']: this.refresh(); return true; }
			
			var fel = find(el, 'onlineheader-'+this.id);
			if (!L.isNull(fel)){
				this.bodyVisibleChange();
				return true;
			}
			
			return false;
		}
	};
	
	NS.OnlineElement = OnlineElement;
	
	var OnlineWidget = function(container){
		this.init(container);
	};
	OnlineWidget.prototype = {
		init: function(container){
			buildTemplate(this, 'widget');
			container.innerHTML = this._TM.replace('widget');
			
			var list = [];
			for (var m in Brick.Modules){
				if (Brick.componentExists(m, 'online') && !Brick.componentLoaded(m, 'online')){
					list[list.length] = {name: m, files:['online.js']};
				}
			}
			if (list.length > 0){
				var __self = this;
				Brick.Loader.add({mod: list,
					onSuccess: function() {__self.buildElements();}
				});
			}else{
				this.buildElements(); 
			}
		},
		destroy: function(){
			NS.manager.foreach(function(onel){
				onel.destroy();
			});
		},
		onResize: function(rel){
			var el = this._TM.getEl('widget.id');
			el.style.height = (rel.height - 20)+'px';
			var w = (rel.width - 50)+'px';
			NS.manager.foreach(function(onel){
				onel.getContainer().style.width = w;
			});
			
		},
		buildElements: function(){
			var TM = this._TM, lst = "";
			
			NS.manager.foreach(function(onel){
				lst += onel.getHTML();
			});
			TM.getEl('widget.list').innerHTML = lst;

			NS.manager.foreach(function(onel){
				onel.onLoad();
			});
		},
		onClick: function(el){
			NS.manager.foreach(function(onel){
				if (onel.pOnClick(el)){ return true; }
			});
			
			return false;
		}
	};
	NS.OnlineWidget = OnlineWidget;

	var OnlinePanel = function(){
		OnlinePanel.superclass.constructor.call(this, {
			fixedcenter: false, 
			width: '420px', height: '470px',
			right: 1, 
			controlbox: 1,
			overflow: false
		});
	};
	YAHOO.extend(OnlinePanel, Brick.widget.Panel, {
		initTemplate: function(){
			buildTemplate(this, 'panel');
			return this._TM.replace('panel');
		},
		onLoad: function(){
			// this.body.style.padding = '3px';
			this.widget = new OnlineWidget(this._TM.getEl('panel.widget'));
			NS.data.request();
		},
		onClick: function(el){
			if (this.widget.onClick(el)){ return true; }
			return false;
		},
		destroy: function(){
			this.widget.destroy();
			OnlinePanel.superclass.destroy.call(this);
		},
		onShow: function(){ this.onResize(); },
		onResize: function(){
			this.widget.onResize(Dom.getRegion(this.body));
		}
	});
	NS.OnlinePanel = OnlinePanel;
	
	API.showOnlinePanel = function(){
		NS.roles.load(function(){
			new OnlinePanel();
		});
	};
	
	var OnlineManager = function(){
		this.init();
	};
	OnlineManager.prototype = {
		init: function(){
			this.onels = {};
		},
		register: function(onel){
			this.onels[onel.id] = onel;
		},
		foreach: function(f){
			if (!L.isFunction(f)){ return; }
			
			for (var id in this.onels){
				if (f(this.onels[id])){ return; }
			}
		}
	};
	NS.OnlineManager = OnlineManager;
	
	NS.manager = new OnlineManager();
	
};