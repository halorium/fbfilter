
// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    // $(document).find('#login').hide();
    // $(document).find('#posts').show();
    $(document).find('#photos').show();

    testAPI();
    // getFeed();
    getPhotos();
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into this app.';
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into Facebook.';
  }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

window.fbAsyncInit = function() {
FB.init({
  appId      : '249802168552434',
  cookie     : true,  // enable cookies to allow the server to access the session
  xfbml      : true,  // parse social plugins on this page
  version    : 'v2.0' // use version 2.0
});

// Now that we've initialized the JavaScript SDK, we call
// FB.getLoginStatus().  This function gets the state of the
// person visiting this page and can return one of three states to
// the callback you provide.  They can be:
//
// 1. Logged into your app ('connected')
// 2. Logged into Facebook, but not your app ('not_authorized')
// 3. Not logged into Facebook and can't tell if they are logged into
//    your app or not.
//
// These three cases are handled in the callback function.

FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
});

};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', function(response) {
    console.log('Successful login for: ' + response.name);
    // document.getElementById('status').innerHTML =
      // 'Thanks for logging in, ' + response.name + '!';
  });
}

function getPhotos() {
  console.log('Fetching your photos...');
  FB.api('/me?fields=photos', function(response) {
    // window.fbResponse = response;
    window.fbResponse = response.photos.data
    console.log(response);
    handlePhotos(response.photos.data);
  });
}

function handlePhotos(photos) {
  for(var i = 0; i < photos.length; i++) {
    displayPhoto(photos[i]);
  }
}

function displayPhoto(photo) {
  // $('.fbphotos').append("<div class='row fbphoto' panel>"+photo.name+"</div>");
  var template = $('#templates .tmp-photos').html();
  Mustache.parse(template);
  var rendered = Mustache.render(template, photo);
  $('.fbphotos').append(rendered);
}

function getFeed() {
  console.log('Fetching your feed...');
  FB.api('/me?fields=posts', function(response) {
    console.log('posts');
    console.log(response);
    handlePosts(response.posts.data);
  });
}

function handlePosts(posts) {
  for(var i = 0; i < posts.length; i++) {
    displayPost(posts[i]);
  }
}

function displayPost(post) {
  if (post.message) {
    $('.fbposts').append("<div class='row fbpost' panel>"+post.message+"</div>");
  }
}

$(document).find('#posts').hide();
$(document).find('#photos').show();

// $(document).on('click', '.fb-login-button', function(){
//   FB.login(function(response) {
//      // handle the response
//      statusChangeCallback(response);

//   }, {scope: 'public_profile,email,user_tagged_places,read_stream'});
// });