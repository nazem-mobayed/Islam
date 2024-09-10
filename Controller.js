console.log('Hello Muslims');
//variables...
quran = ['Alfatiha','Albaqara','Aal-i-imraan','An-Nisaa','Al-maaida',"Al-An'aam","Al-A'raaf",'Al-Anfaal','At-Tawba','Yunus','Hud','Yusuf',"Ar-Ra'd",'Ibrahim','Alhijr','An-Nahl','Al-Israa','Al-Kahf','Maryam','Taa-Haa','Al-Anbiyaa','Al-Hajj','Al-Muminoon','An-Noor','Al-Furqaan',"Ash-Shu'araa",'An-Naml','Al-Qasas','Al-Ankaboot','Ar-Room','Luqman','As-Sajda','Al-Ahzaab','Saba','Fatir','Yaseen','As-Saaffaat','Saad','Az-Zumar','Ghaafir','Fussilat','Ash-Shura','Az-Zukhruf','Ad-Dukhaan','Al-Jaathiya','Al-Ahqaf','Muhammad','Al-Fath','Al-Hujuraat','Qaaf','Adh-Dhaariyat','At-Tur','An-Najm','Al-Qamar','Al-Rahmaan','Al-Waaqia','Al-Hadid','Al-Mujaadila','Al-Hashr','Al-Mumtahana','Al-Saff',"Al-Jumu'a",'Al-Munaafiqoon','Al-Taghaabon','At-Talaaq','At-Tahrim','Al-Mulk','Al-Qalam','Al-Haaqqa',"Al-Ma'aarij",'Nooh','Al-Jinn','Al-Muzzammil','Al-Muddaththir','Al-Qiyaama','Al-Insaan','Al-mursalaat','Al-Naba',"Al-Naazi'aat",'Abasa','Al-Takwir','Al-Infitaar','Al-Mutaffifin','Al-Inshiqaaq','Al-Burooj','At-Taariq',"Al-A'laa",'Al-Ghaashiya','Al-Fajr','Al-Balad','Ash-Shams','Al-Lail','Ad-Dhuhaa','Ash-Sharh','At-Tin','Al-Alaq','Al-Qadar','Al-Bayyina','Az-Zalzala','Al-Aadiyaat',"Al-Qaari'a",'At-Takaathur','Al-Asr','Al-Humaza','Al-Fil','Quraish',"Al-Maa'un",'Al-Kawthar','Al-Kaafiroon','An-Nasr','Al-Masad','Al-Ikhlass','Al-Falaq','An-Naas']
pageOpened = 1
surrahOpened = 1
allPages = 0
audio = false;
audioPath = 'none';
sheikh = 1;
alertMessage = true;
audio_player_shown = false,command = '';
let config, sheikhURL;

function audioSet(num) {
  sheikhURL = 'https://api.quran.com/api/v4/chapter_recitations/'+String(num)+'/'+String(surrahOpened);
  config = {
  method: 'get',
maxBodyLength: Infinity,
  url: sheikhURL,
  headers: { 
    'Accept': 'application/json'
  }
};
$('.loading').show()
axios(config)
.then((response) => {
  audioPath = response.data['audio_file']['audio_url'];
  $('audio').attr('src',audioPath);
  setTimeout(()=>{
    $('.loading').hide()
  },500)
})
.catch((error) => {
  alert(error);
});

}


$(document).ready(function(){
  $('.loading').hide()
  $('.audio-player').hide()
  $('div.alertMessage').hide()
  $('.search-surrah').hide()
  $('.bookmark-options').hide()
   $.getJSON('/Quran/Alfatiha.json',showSurrah)
})

function showMessage(message) {
  switch(message) {
    case true:
      $('div.alertMessage b').html('signal_wifi_4_bar')
      $('div.alertMessage font').html('تمت إعادة الاتصال')
      setTimeout(function(){
        $('div.alertMessage').slideToggle(700)
      },1500)
      
      break;
      case false:
        $('div.alertMessage b').html('signal_wifi_off')
      $('div.alertMessage font').html('لا يوجد اتصال بالانترنت')
      $('div.alertMessage').slideToggle(700)
        break;
  }
}

function next(about,num) {
  switch(about) {
    case 'surrah' :
      if (surrahOpened == quran.length) {
       $.getJSON('/Quran/Alfatiha.json',showSurrah)
       surrahOpened = 1
      }
      else {
        surrahOpened += 1
        $.getJSON('/Quran/' + quran[surrahOpened-1] + '.json',showSurrah)
      }
      pageOpened = 1
      command = 'surrah';
      break;
    case 'page' :
      if (pageOpened != allPages) {
        pageOpened += 1
      }
      else {
        pageOpened = 1
      }
      $.getJSON('/Quran/' + quran[surrahOpened - 1] + '.json', showSurrah)
      command = 'page';
      break;
      case 'open':
        surrahOpened = num + 1
        pageOpened = 1
        $.getJSON('/Quran/'+quran[surrahOpened-1]+'.json',showSurrah)
        $('.search-surrah').fadeToggle(1200)
        command = 'surrah';
        break;
  }
  mark();
}

function previous(about) {
  switch (about) {
    case 'surrah':
      if (surrahOpened == 1) {
        surrahOpened = quran.length 
        $.getJSON('/Quran/'+quran[surrahOpened - 1] + '.json', showSurrah)
      }
      else {
        surrahOpened -= 1
        $.getJSON('/Quran/' + quran[surrahOpened -1] + '.json',showSurrah)
      }
      pageOpened = 1
      command = 'surrah'
      break;
    case 'page' :
      if (pageOpened == 1) {
        pageOpened = allPages
      }
      else {
        pageOpened -= 1
      }
      $.getJSON('/Quran/' + quran[surrahOpened - 1] + '.json', showSurrah)
      command = 'page';
      break;
  }
  mark()
}

function lastPage() {
  pageOpened = allPages
  $.getJSON('/Quran/' + quran[surrahOpened - 1] + '.json', showSurrah)
}

function play() {
  $('.audio-player').slideToggle(900)
  switch(audio) {
    case false :
      $('#playAudio').text('أوقف الصوت')
      audio_player_shown = true;
      audioSet(sheikh)
      audio = true
      break;
      case true :
        document.querySelector('audio').pause()
        $('#playAudio').text('شغل الصوت')
        audio_player_shown = false;
        audio = false
        break;
  }
}

function setSheikh(num) {
  sheikh = num;
   $.getJSON('/Quran/' + quran[surrahOpened - 1] + '.json', showSurrah)
   audioSet(sheikh)
}

function showSurrah(surrah) {
  //her name :
  $('h3.name').html('<span class="fas fa-caret-down"></span>'+surrah['name'])
  //surrah number
  $('span#surrahNo').text('رقمها ' + surrah['surrahNo.'])
  //number of its ayats
  $('span#ayatNo').text('آياتها ' + surrah['ayatNo.'])
  if(pageOpened != 1) {
    $('div.content h4').hide()
  }
  else {
    $('div.content h4').show()
  }
  if (surrah['b'] == false) {
    $('div.content h4').text('بسمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ (1)')
  }
  else if (surrah['b'] == "no") {
    $('div.content h4').text('أعوذ بالله من الشيطان الرجيم')
  }
  else {
    $('div.content h4').text('بسمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ')
  }
  //showing the first page of it...
  $('div.ayat').text(surrah['ayat'][pageOpened - 1])
  //number of the surrah's page which is opened
  allPages = surrah['ayat'].length
  $('span#pages').text(allPages+'/'+pageOpened)
  if(audio_player_shown == true && command == 'surrah' ) {
    audioSet(sheikh);
  }
  mark()
} 

function search() {
  $('.search-surrah').slideToggle(1500)
}

function whichCommand() {
      var pageIs = localStorage.getItem('bookmarkpage');
      var surrahIs = localStorage.getItem('bookmarksurrah');
      if (pageIs == pageOpened && surrahIs == surrahOpened) {
        bookmark('delete');
      }
      else if (pageIs == null && surrahIs == null) {
        bookmark('add');
      }
      else if (pageIs != null && surrahIs != null) {
        if (pageIs == pageOpened && surrahIs != surrahOpened || pageIs != pageOpened && surrahIs == surrahOpened || pageIs != pageOpened && surrahIs != surrahOpened) {
          $('.bookmark-options').slideToggle(600)
        }
      }
  mark()
}

function mark() {
  var page = localStorage.getItem('bookmarkpage');
  var surrah = localStorage.getItem('bookmarksurrah');
  if ( page == pageOpened && surrah == surrahOpened ) {
    $("#mark").attr("class","fas fa-bookmark")
  }
  else if ( page != pageOpened || surrah != showSurrah ) {
    if ( page != null && surrah != null ) {
      $("#mark").attr("class","fas fa-book")
    }
    else {
      $('#mark').attr("class","far fa-bookmark")
    }
  }
}

function bookmark(command) {
  switch(command) {
    case 'add':
      localStorage.setItem('bookmarkpage',pageOpened)
      localStorage.setItem('bookmarksurrah',surrahOpened)
      break;
      case 'go':
        var x = localStorage.getItem('bookmarkpage')
        var y = localStorage.getItem('bookmarksurrah')
        if (x != undefined && y != undefined ) {
          pageOpened = Number(x)
          surrahOpened = Number(y)
          $.getJSON('/Quran/' + quran[surrahOpened - 1] + '.json', showSurrah)
        }
        break;
        case 'delete':
          localStorage.removeItem('bookmarkpage')
          localStorage.removeItem('bookmarksurrah')
          break;
  }
}

function cancel() {
  $('.bookmark-options').slideToggle(600)
}

function bookmarkOption(num) {
  switch(num) {
    case 1:
      bookmark('delete')
      bookmark('add')
      mark()
      break;
      case 2:
        bookmark('go')
        break;
  }
  cancel()
}