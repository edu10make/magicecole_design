let searchMode = false;


$(document).ready(function () {
    
    $('#id_search').click(function () {
        if ($('#id_input_search').val() == '') {
            //alert('내용을 입력해 주세요.');
            $('#id_input_search').focus();
            if (searchMode===true) {
                searchMode=false;
                updateUserList(false);
            }
        } else {
            let message = $('#id_input_search').val();
            //$('#id_input_search').val('');
            searchMode = true;
            updateUserList(false,message);
        }
    });
});

var firebaseConfig = {
    apiKey: "AIzaSyDFTeUwWs2D1BcyqFG7E4AyMPIytKxU12U",
    authDomain: "magiceco-vm.firebaseapp.com",
    databaseURL: "https://magiceco-vm.firebaseio.com",
    projectId: "magiceco-vm",
    storageBucket: "magiceco-vm.appspot.com",
    messagingSenderId: "673174962250",
    appId: "1:673174962250:web:d858cb17752f6e193de6b3"
};
firebase.initializeApp(firebaseConfig);


var database = firebase.database();
let nowUID = '';


// ---> 사용자 키가 바뀌면, 이벤트 제거하고! 새로운 키로 셋팅한다.

var starCountRef;




function initUserList(pa_uid) {
    if (pa_uid === undefined) {
        return;
    }
    nowUID = pa_uid;
    if (starCountRef !== undefined) {
        starCountRef.off();
    }
    starCountRef = database.ref('message/' + pa_uid);
    let keyList = [];
    starCountRef.orderByKey().once('value', function (snapshot) {
        let listData = snapshot.val();
        keyList = Object.keys(listData);
        createUserChat(listData)
        //
        starCountRef.orderByKey().limitToLast(1).on('child_added', function (snapshot) {
            if (keyList.indexOf(snapshot.key) !== -1) {
                return;
            }
            addUserChat(snapshot.val());
        });
    });

    // 선택된 아이디만... 배경색 클래스로 바꾸기??
    let findUserListTag = $('#chatDirectMsg').find('a');

    for (let i = 0; i < findUserListTag.length; i++) {
        if ($(findUserListTag[i]).attr('id') === pa_uid) {
            $(findUserListTag[i]).attr('class', 'media active');
        } else {
            $(findUserListTag[i]).attr('class', 'media');
        }
    }

    viewUserDetail(pa_uid)
}



function createUserChat(pa_chatList) {
    let html = ``;
    $('.chat-group').empty();
    for (let unit in pa_chatList) {
        var date = new Date(pa_chatList[unit].timestamp);
        var strDate = getDigit(date);
        let pClass = 'badge badge-primary';
        
        if (pa_chatList[unit].intent == 'Default Fallback Intent') {
            pClass = 'badge badge-warning';
        } else if (pa_chatList[unit].intent == 'Event') {
            pClass = 'badge badge-danger';
        }
        html = getHTML_chat(pClass, strDate, pa_chatList[unit].intent, pa_chatList[unit].query, pa_chatList[unit].response);
        $('.chat-group').append(html)
    }
    $('.chat-group').scrollTop($('.chat-group')[0].scrollHeight);

}

function addUserChat(pa_item) {
    let date = new Date(pa_item.timestamp);
    let strDate = (date.getMonth() + 1) + '.' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();

    
    let pClass = 'badge badge-primary';
    if (pa_item.intent == 'Default Fallback Intent') {
        pClass = 'badge badge-warning';
    } else if (pa_item.intent == 'Event') {
        pClass = 'badge badge-danger';
    }

    html = getHTML_chat(pClass, strDate, pa_item.intent, pa_item.query, pa_item.response);
    $('.chat-group').append(html);
    $('.chat-group').scrollTop($('.chat-group')[0].scrollHeight);
}

function getHTML_chat(pa_class, strDate, intent, pa_query, pa_response) {

    let htmlStr = `
    <div class="d-flex">
        <div class="wd-30 ht-30 bd rounded-circle align-items-center justify-content-center d-none d-sm-flex">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user wd-20 ht-20"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <div class="media-body"><span class="${pa_class}">${intent}</span>
            <small>${strDate}</small>
            <div class="d-flex">
                <p class="userChat"></p>
            </div>
        </div>
    </div>
    <div class="d-flex justify-content-end">
            <p class="botChat">답변입니다.</p>
        </div>
    </div>
    <br>
    `;


    html = $(htmlStr);
    if (pa_query === '') {
        let userChatNode = $(html).find('div.d-flex')
        userChatNode.remove();
    } else {
        $(html).find('p.userChat').text(pa_query);
    }
    $(html).find('p.botChat').text(pa_response);
    return html;
}



let userListData = [];
let userKey = [];

var userListRef = database.ref('userList/');

function initAuth() {
    userListRef.orderByKey().once('value', function (snapshot) {
        let dataList = snapshot.val();
        for (let key in dataList) {
            userListData.push(dataList[key]);
            userKey.push(dataList[key].uid);
        }

        updateUserList(true);

        // 유저추가시
        userListRef.limitToLast(1).on('child_added', function (snapshot) {
            if (userKey.indexOf(snapshot.key) !== -1) {
                return;
            }
            let item = snapshot.val();
            userListData.push(item);
            userKey.push(item.uid);
            updateUserList();
        });

        // 유저 데이터 변경시
        userListRef.on('child_changed', function (snapshot) {
            let isCheck = false;
            for (let i = 0; i < userListData.length; i++) {
                if (userListData[i].uid === snapshot.key) {
                    userListData[i] = snapshot.val();
                    isCheck = true;
                    break;
                }
            }
            if (isCheck) {
                updateUserList();
            }
        });
    });

}


function updateUserList(isFirst,searchID) {
    // 배열을 update 값에 따라서 정렬
    userListData.sort(function (a, b) {
        if (a.update > b.update) {
            return -1;
        }
        if (a.update < b.update) {
            return 1;
        }
        // a must be equal to b
        return 0;
    });

    $('#chatDirectMsg').empty();
    let html = ''

    if (isFirst === true) {
        initUserList(userListData[0].uid);
    }

    for (let i = 0; i < userListData.length; i++) {
        let date = new Date(userListData[i].update);
        let strDate = getDigit(date);

        html = getHTML_userList(userListData[i].uid, userListData[i].name, strDate, userListData[i].message);
        if (searchID===undefined) {
            $('#chatDirectMsg').append(html);
        } else {
            
            if ( (userListData[i].name).indexOf(searchID) !== -1) {
                $('#chatDirectMsg').append(html);
            }
        }
        

    }



}


function updateUserName(pa_imageURL, pa_name) {
    //
    if (pa_name === '') {
        pa_name = 'USER'
    }
    /*
    //
    if (pa_imageURL === '') {
        $('#chatTop').html(
            `<div class='top_name_list'>${pa_name}</div>
            `
        );
    } else {
        $('#chatTop').html(
            `<div class='topImage'><img src='${pa_imageURL}' width='46px' height='46px'></div>
            <div class='top_name_list'>${pa_name}</div>
            `
        );
    }
    */
    $('#top_user_image').empty();
    if (pa_imageURL === '') {
        $('#top_user_image').append(`<i data-feather="user" class="wd-40 ht-40"></i>`);
        feather.replace();
    } else {
        $('#top_user_image').append(`<img class="wd-40 ht-40 rounded-circle" src='${pa_imageURL}'>`);
    }

    $('#top_user_name').text(pa_name);

}



function getHTML_userList(uid, name, strDate, message) {
    

    let classUnit = 'media'
    if (uid === nowUID) {
        classUnit = 'media active'
    }
    html = $(
        `   <a id="${uid}" href="#" class='${classUnit}' onclick="initUserList('${uid}')">
      <div class="media-body">
        <div class="d-flex justify-content-between">
          <h6>${name}</h6>
          <small class="d-block">${strDate}</small>
        </div>
        <div class="me_user_query user_query"></div>
      </div><!-- media-body -->
    </a><!-- media -->`
    );
    if (message === "" || message === undefined) {
        message = "-";
    }
    $(html).find('div.me_user_query').text(message);
    return html;
}



// --------------------------------------------------
// 유저 정보 보기


let iconRef = {
    phone_number: 'phone',
    start_timestamp: 'clock',
    profile_image_url: 'instagram',
    app_user_id: 'file',
    uid: 'settings'
}

//<div><i data-feather="clock" class="user_icon"></i></div>
//<div><i data-feather="phone" class="user_icon"></i></div>
//<div><i data-feather="instagram" class="user_icon"></i></div>
//<div><i data-feather="file" class="user_icon"></i></div>
//<div><i data-feather="settings" class="user_icon"></i></div>


let appID = "";

function viewUserDetail(pa_uid) {


    var userDetailRef = database.ref(`users/${pa_uid}`);
    userDetailRef.orderByKey().once('value', function (snapshot) {
        let dataList = snapshot.val();

        appID = dataList['app_user_id'];
        
        if (appID === '' || appID === undefined) {
            enableNoticeButton(true);
        } else {
            enableNoticeButton(false);
        }

        let html = ''
        if (Object.keys(dataList).length > 0) {

            $('#user_info_chatbot').empty();
            $(".sidebar-name").text ( dataList.nickname);
            $(".sidebar-mail").text ( dataList.email);
            
            for (unit in iconRef) {
                
                if (dataList[unit] === '' || dataList[unit] === undefined) {
                    continue;
                }
                if (unit.indexOf('timestamp') != -1) {
                    var stamp = new Date(dataList[unit]);
                    html += `<div>${stamp}</div>`;
                } else if (unit === 'profile_image_url') {
                    if (dataList[unit]) {
                        html += `<div><img src=${dataList[unit]} width='200' height='200'></img></div>`;
                    }

                } else {
                    html += `<div>${unit} : ${dataList[unit]}</div>`;
                }

                let detailHtml = $(
                    `<div class='d-flex flex-row mg-b-10'>
                        <div class='user_icon'>
                            <div><i data-feather="${iconRef[unit]}" class="user_icon"></i></div>
                        </div>
                    <div class='user_desc'></div>
                </div>`)

                if (unit === 'start_timestamp') {
                    let date = new Date(dataList[unit]);
                    $(detailHtml).find('div.user_desc').text(getDigit(date));
                } else {
                    $(detailHtml).find('div.user_desc').text(dataList[unit]);
                }
                

                $('#user_info_chatbot').append(detailHtml);
                feather.replace();

            }

            updateUserName(dataList.profile_image_url, dataList.nickname)

        }


    });




}



function getDigit(pa_date) {

    let today = new Date().toISOString();
    let targetDay = pa_date.toISOString();

    let result = getDigit2(pa_date.getMonth() + 1) + '월 ' + getDigit2(pa_date.getDate()) + '일 ' + getDigit2(pa_date.getHours()) + ':' + getDigit2(pa_date.getMinutes());
    if (today.split('T')[0] === targetDay.split('T')[0]) {
        let hourStr = '오전 ' + pa_date.getHours();
        if (pa_date.getHours() > 12) {
            hourStr = '오후 ' + (pa_date.getHours() - 12);
        }
        result = hourStr + ':' + getDigit2(pa_date.getMinutes());
    }


    return result;
}

function getDigit2(pa_num) {
    return (pa_num < 10) ? "0" + String(pa_num) : String(pa_num);
}




let userData = {};
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        
        // User is signed in.
        userData.displayName = user.displayName;
        userData.email = user.email;
        userData.emailVerified = user.emailVerified;
        userData.photoURL = user.photoURL;
        userData.isAnonymous = user.isAnonymous;
        userData.uid = user.uid;
        userData.providerData = user.providerData;
        

        //startAdmin();
        initAuth()
    } else {
        
        firebase.auth().signInWithEmailAndPassword('yh.kim@magice.co', 'magic0922').catch(function (error) {
            // Handle Errors here.
            console.log('check error Login : ', error.code, error.message);
            // ...
        });
    }
});


function initSendMessageView() {
    $('#inputAdmin').empty();
    let html = $(
        `<div class="flexInput">
        <textarea id="story" name="story"></textarea>
    </div>
    <div class="flexInputButton">
        <button class="button" id="sendButton">전송</button>
    </div>`
    )
    $('#inputAdmin').html(html);
    $('#sendButton').attr('disabled', true);



    $('#sendButton').click(function () {
        if ($('#story').val() == '') {
            alert('내용을 입력해 주세요.');
            $('#story').focus();
        } else {
            if (appID === '') {
                alert('플러스친구로 등록된 사용자에게만 메세지를 보낼 수 있습니다.');
                return;
            }
            let message = $('#story').val();
            $('#story').val('');
            sendMessage(message, appID);
        }
    });
}




initSendMessageView();

function enableNoticeButton(pa_boolean) {
    $('#sendButton').attr('disabled', pa_boolean);
    if (pa_boolean) {
        $('#story').val('인증된 사용자에게만 메세지를 보낼 수 있습니다.');
    } else {
        $('#story').val('');
    }
}


function sendMessage(pa_message, pa_uid) {

    
    if (pa_uid === '') {
        return;
    }

    axios.post('https://chatbot.10make.com/skill/notice', {
            message: pa_message,
            uid: pa_uid
        })
        .then(function (response) {
            
        })
        .catch(function (error) {
            console.log(error);
        });
}
