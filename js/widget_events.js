$(function() {
  $(document).click(function(e) {
	var clicked_node = $(e.target);

	if(clicked_node.is('a')) {
	  if(clicked_node.is('.song')) {
		return song_click(clicked_node);
	  }	
	  else if(clicked_node.is('.waiting-full-render')) {
		if (wainter_for_play) {wainter_for_play.removeClass('marked-for-play');}
		clicked_node.data('want_to_play', want_to_play += 1).addClass('marked-for-play');
		wainter_for_play = clicked_node;
		return false;
	  }
	  else if(clicked_node.is('.vk-reg-ref')) {
		widget.openURL(vkReferer);
		return false;
	  }
	  else if (clicked_node.is('.flash-s')){
		widget.openURL('http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html');
		return false;
	  }
	  else if (clicked_node.is('.artist')){
		artist_name = decodeURIComponent(clicked_node.data('artist'));
		setArtistPage(artist_name);
		return false;
	  }
	  else if(clicked_node.is('.music-tag')){
		tag_name = decodeURIComponent(clicked_node.data('music_tag'));
		render_tracks_by_artists_of_tag(tag_name);
		return false;
	  }
	  else if(clicked_node.is('.bbcode_artist')){
	  	artist_name = decodeURIComponent(clicked_node.attr('href').replace('http://www.last.fm/music/',''));
	  	setArtistPage(artist_name);
	    return false;
	  }
	  else if(clicked_node.is('.bbcode_tag')){
		tag_name = decodeURIComponent(clicked_node.attr('href').replace('http://www.last.fm/tag/',''));
	    render_tracks_by_artists_of_tag(tag_name);
		return false;
	  }
	  else if(clicked_node.is('.artist-list')){
		proxy_render_artists_tracks(clicked_node.data('artist_list'));
		$(art_page_nav).text('Similar to «' + current_artist + '»');
	  }
	}
  });
  
  
	$('#close-widget').click(function(){
		window.close();
	});
	
		//see var at top
	  slider = document.getElementById('slider');
	  searchfield = document.getElementById('q');
	  srnav = document.getElementById('search_result_nav');
	  startlink = document.getElementById('start_search');
	  searchres = document.getElementById('search_result');
	  art_page_nav = document.getElementById('nav_artist_page');
	  trk_page_nav = document.getElementById('nav_tracks_page');
	  startlink.onclick = function(){
		slider.className = "screen-start";
	  };
	  srnav.onclick = function(){
		slider.className = "screen-search";
	  };
	
		artsHolder	= $('#artist-holder');
		artsImage	= $('img.artist-image',artsHolder);
		artsBio		= $('.artist-bio',artsHolder);
		artsTracks	= $('.tracks-for-play',artsHolder);
		artsplhld	= $('.player-holder',artsHolder);
		art_tracks_w_counter = $('.tracks-waiting-for-search',artsHolder)
		artsName	= $('#artist-name');
		
		tracksHolder = $('#tracks-holder');
		tracksTracks = $('.tracks-for-play', tracksHolder);
		tracksName	 = $('#tracks-name');
		trksplhld	 = $('.player-holder',tracksHolder);
		
	var flash_settings = $('.internet-flash-settings input');
		
	flash_settings.change(function(){
		if($(this).attr('checked')) {
			widget.setPreferenceForKey('true', 'flash_internet');
			$(document.body).addClass('flash-internet');
		} else {
			widget.setPreferenceForKey(null, 'flash_internet');
			$(document.body).removeClass('flash-internet');
		}
	});
	
	if (widget.preferenceForKey('flash_internet')) {
		$(document.body).addClass('flash-internet');
		flash_settings.attr('checked', 'checked');
	}
	
	
	
	$('.vk-auth').submit(function(){
		var _this = $(this);
		var email = $('input.vk-email',_this).val();
		var pass = $('input.vk-pass',_this).val();
		vk_login(email,pass);
		return false;
	});
	
	  if (widget.preferenceForKey('vkid')) {
		$(document.body).addClass('vk-logged-in');
		vk_logged_in = true;
		vk_login_check();
	  } else{
		log('not loggin in');
	  }
	
	
	
	$('#search-artist').click(function(){
		var query = searchfield.value;
		if (query) {
			artistsearch(query);
		}
		
		
	});
	$('#search-tag').click(function(){
		var _this = $(this);
		var query = searchfield.value;
		if (query) {
			render_tracks_by_artists_of_tag(query);
		}
		
	});
	$('#search-track').click(function(e){
		var _this = $(this);
		var query = searchfield.value;
		if (query) {
			vk_track_search(query)
		}
		
	});
	
	
	var get_lfm_token = function(lfm_auth,callback){
		lfm('auth.getToken',false,function(r){
			lfm_auth.newtoken = r.token;
			log(lfm_auth.newtoken);
			if (callback) {callback(lfm_auth.newtoken);}
		})
	}
	var open_lfm_to_login = function(token){
		widget.openURL('http://www.last.fm/api/auth/?api_key=' + apikey + '&token=' + token);
		$(document.body).addClass('lfm-waiting-for-finish');
	};
	
	if (!lfm_auth.sk) {
		get_lfm_token(lfm_auth);
	}

	$('.login-lastfm-button').click(function(){

		
		if (lfm_auth.newtoken) {
			open_lfm_to_login(lfm_auth.newtoken);
		} else {
			get_lfm_token(lfm_auth,open_lfm_to_login);
		}
		
		return false
	})
	
	var lfm_fin_recomm_check = $('#login-lastfm-finish-recomm-check'),
		lfm_fin_recomm		 = $('#login-lastfm-finish-recomm');
	var lfm_fin_loved_check  = $('#login-lastfm-finish-loved-check'),
		lfm_fin_loved		 = $('#login-lastfm-finish-loved');
		
		
	lfm_fin_recomm_check.change(function(){
		if ($(this).attr('checked')) {
			lfm_fin_recomm.attr('disabled', null);
		} else {
			lfm_fin_recomm.attr('disabled', 'disabled');
		}
	});
	lfm_fin_loved_check.change(function(){
		if ($(this).attr('checked')) {
			lfm_fin_loved.attr('disabled', null);
		} else {
			lfm_fin_loved.attr('disabled', 'disabled');
		}
	});
	lfm_fin_recomm.click(function(){
		if(lfm_fin_recomm_check.attr('checked')){
			lfm('auth.getSession',{'token':lfm_auth.newtoken },function(r){
				if (!r.error) {
					lfm_auth.login(r);
					render_recommendations();
				}
			});
			return false
		}
	});
	lfm_fin_loved.click(function(){
		if(lfm_fin_loved_check.attr('checked')){
			lfm('auth.getSession',{'token':lfm_auth.newtoken },function(r){
				if (!r.error) {
					lfm_auth.login(r);
					render_loved();
				}
			});
			return false
		}
	})
	$('#lfm-recomm').click(function(){
		if(!lfm_auth.sk){
			$(document.body).toggleClass('lfm-auth-req-recomm');
		}else {
			render_recommendations();
		}
	})
	$('#lfm-loved').click(function(){
		if(!lfm_auth.sk){
			$(document.body).toggleClass('lfm-auth-req-loved');
		}else {
			render_loved();
		}
	})
	$('#lfm-loved-by-username').submit(function(){
		var _this = $(this);
		render_loved(_this[0].loved_by_user_name.value);
		$(document.body).removeClass('lfm-auth-req-loved');
	})
	$('#lfm-recomm-for-username').submit(function(){
		var _this = $(this);
		render_recommendations_by_username(_this[0].recomm_for_username.value);
		$(document.body).removeClass('lfm-auth-req-recomm');
	})

});