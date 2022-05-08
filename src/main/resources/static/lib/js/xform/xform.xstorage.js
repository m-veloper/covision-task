/*---------------------
        Storage
    ---------------------*/

XFORM.storage = (function () {

    //var prefix = 'html';
    var prefix,
        current_version,
        version_length,
	    last_version_namespace = 'last_version',
	    verson_length_namespace = 'verson_length',
	    getHistoryPrefix,
        getHistoryPrefixHead,
        getExplicitKey,
        checkExplicit,
	    setStorage,
        saveExplicit,
	    getStorage,
	    supports_local_storage,
	    delStorageItem,
        getAllVersion, //모든 버전을 배열로 반환
        clearAllHistory, //모든 버전 삭제
	    reDraw,
	    existKey,
	    versioning,
	    versionLength,
	    lastVersion,
	    setCurrent,
	    delStorageTracer,
	    goVersion,
	    goBackward,
	    goForward,
	    putStorageTracer,
	    versionToKey,
	    keyToVersion,
        tempSave,
	    param1;

    var init = function () {
        prefix = getHistoryPrefix();
        if (prefix == '') prefix = 'unnamed';
    
        var v = lastVersion();
        var i = (v == null) ? 0 : v;
    
        $('#get').click(function () {
            event.stopPropagation();
            var s = getStorage();
            $('#storage-history-pulled').val(s);
        });
    
        //save
        $('.history-save').click(function (event) { // [16-04-07] kimhs, event객체 받아와서 처리
            event.stopPropagation();
            var ver;
            ver = parseInt(lastVersion()) + 1;
            setStorage(ver);
            putStorageTracer(ver);
            //reDraw();
            setCurrent(ver); //마지막 버전에 위치 
            XFORM.form.showStatus('temporarily saved!');
        });
        $('#remove').click(function () {
            event.stopPropagation();
            $('#canvas').find('table').first().remove();
        });
    
        $('.history-clear').click(function () {
            event.stopPropagation();
            if (confirm('임시 저장된 기록을 삭제합니다')) {
                $.jStorage.flush();
                $('.delete-storage-item').each(function () {
                    event.stopPropagation();
                    $(this).click();
                });
            }
        });

        $('.template-original').click(function () {
            event.stopPropagation();
            //원본 로드
            XFORM.template.reload();
        });
    
        reDraw();
    
        version_length = versionLength();
    }


    var historyBack = function () {
        XFORM.loader.show();
        //event.stopPropagation();

        var res = goBackward();
        if (res == false) {
            alert('변경로그의 맨 앞입니다.');
            XFORM.loader.hide();
            return;
        }

        setTimeout(function () {
            XFORM.template.loadToCanvas('', $('#canvas').html(), $('#canvas_js').val()); // [16-03-31] kimhs, js내용 파라미터 추가
            XFORM.loader.hide();
        }, 100);

    };

    var historyForward = function () {
        event.stopPropagation();
        var res = goForward();
        if (res == false) {
            alert('변경로그의 맨 뒤입니다.');
            return;
        }

        XFORM.template.loadToCanvas('', $('#canvas').html(), $('#canvas_js').val()); // [16-03-31] kimhs, js내용 파라미터 추가
    };

    var historyRestore = function () {
        //event.stopPropagation();
        $('#canvas').empty();
        XFORM.template.loadToCanvas('', $('#storage-history-pulled').val(), $('#canvas_js').val()); // [16-03-31] kimhs, js내용 파라미터 추가
    };

    getHistoryPrefix = function () {
        return ($('#hidFilename').val() != '') ? $('#hidFilename').val() : 'unnamed';
    }
    setStorage = function (ver) {
        //var html = $('#canvas').clone();
        var htmlString = $('#canvas').html();
    
        $.jStorage.set(versionToKey(ver), htmlString);
    }
    getHistoryPrefixHead = function () {
        var prefix = getHistoryPrefix();
        var prefix_name = prefix.substr(0, prefix.indexOf('.'));
        return prefix_name;
    }
    saveExplicit = function (ver) {
        var key = getExplicitKey();
        var old_val = $.jStorage.get(key);
        if (typeof old_val === 'undefined' || old_val == null || old_val == '') {
            old_val = '^';
        }
        var new_val = old_val + ver + '^';

        $.jStorage.set(key, new_val);
    }
    getExplicitKey = function () {
        var prefix_name = getHistoryPrefixHead();
        var key = prefix_name + '.explicit';
        return key;
    }
    checkExplicit = function (ver) {
        var key = getExplicitKey();
        var val = $.jStorage.get(key);
        val = (val) ? val : '';
        var comp_val = '^' + ver + '^';
        if (val.indexOf(comp_val) > -1) {
            return true;
        } else {
            return false;
        }
    }
    getStorage = function (ver) {
        var s = $.jStorage.get(versionToKey(ver));
        return s;
    }
    supports_local_storage = function () {
        try {
            return 'localStorage' in window && window.localStorage !== null;
        } catch (e) {
            return false;
        }
    }
    delStorageItem = function (ver) {
        var key = versionToKey(ver);
        $.jStorage.deleteKey(key);
        var success = (!existKey(ver)) ? true : false;
        return success;
    }

    //History에 남아 있는 모든 버전을 배열로 반환
    //양식 파일명을 key로 storage를 조사함. 
    getAllVersion = function () {

        var prefix = getHistoryPrefix();
        var key,
            index = $.jStorage.index();
        var j = 0,
            versions = [];

        for (var i = 0; i < index.length; i++) {
            key = index[i];
            if (key.indexOf(prefix) > -1) {
                versions.push(keyToVersion(key));
                j++;
            }
        }

        return versions;
    }
    checkHistory = function () {
        //템플릿 로드시 최초 1개는 원본과 동일
        return (getAllVersion().length > 0) ? true : false;
    }
    //history를 삭제하고, 전체 개수와 실패개수를 반환
    //결과값: returns.total 전체개수 returns.fail 실패개수
    clearAllHistory = function () {
        var versions = getAllVersion();
        var total, fail = 0, result, returns = {};
        total = versions.length;
        //버전 삭제
        for (var i in versions) {
            result = delStorageItem(versions[i]);
            if (!result) fail++;
        }
        returns.total = total;
        returns.fail = fail;
        //Tracer 다시 로드
        reDraw();

        return returns;
    }

    //renew version history
    reDraw = function () {
    
        var prefix = getHistoryPrefix();
    
        $('#version_tracer .storage-history').empty();
    
        var index, key;
        index = $.jStorage.index();
        var j = 0;
    
        for (var i = 0; i < index.length; i++) {
            key = index[i];
            if (key.indexOf(prefix) > -1) {
                putStorageTracer(keyToVersion(key));
                j++;
            }
        }
    }
    existKey = function (ver) {
        var index, key, key_exist = false;
        key = versionToKey(ver);
        index = $.jStorage.index();
        for (var i = 0; i < index.length; i++) {
            if (key == index[i]) {
                key_exist = true;
                break;
            }
        }
        return key_exist;
    }
    versioning = function () {
        var index = $.jStorage.index();
        var j = -1;
        var last;
        var result = {};
        var prefix = getHistoryPrefix();
        var lastver;
    
        for (var i = 0; i < index.length; i++) {
            let key = index[i];
            if (key.indexOf(prefix) > -1) {
                last = key;
                j++;
            }
        }
    
        lastver = (last != null) ? keyToVersion(last) : -1;
    
        result.lastindex = j;
        result.count = j + 1;
        result.lastversion = lastver;
    
        return result;
    }
    versionLength = function () {
        return versioning().lastindex + 1;
    }
    lastVersion = function () {
        return versioning().lastversion;
    }
    setCurrent = function (ver) {
        current_version = ver;
        $('span.history-tracer-ver').text(ver);
        $('.storage-history *').removeClass('version-selected');
        $('[data-history-ver="' + ver + '"]').addClass('version-selected');
    }
    delStorageTracer = function (ver) {
        $('#version_tracer .storage-history .storage-history-ver[data-history-ver=' + ver + ']').remove();
        $('#version_tracer .storage-history .delete-storage-item[data-history-ver=' + ver + ']').remove();
    }
    goVersion = function (ver) {
        var s = getStorage(ver);
        $('#storage-history-pulled').val(s); //복원할 데이터를 textarea 에 저장
        historyRestore(); //version 복원
        setCurrent(ver); //현재 버전으로 설정
    }
    goBackward = function () {
        if (versionLength() == 0) {
            alert('임시저장된 변경 이력이 없습니다.');
            return;
        }
        //마지막 부터 시작
        if (current_version == null) {
            current_version = lastVersion();
            goVersion(current_version);
            return;
        }
    
        var v = parseInt(current_version);
        if (v > 0) {
            goVersion(--v);
            current_version = v;
            return true;
        } else {
            return false;
        }
    }
    goForward = function () {
        if (versionLength() == 0) {
            alert('임시저장된 변경 이력이 없습니다.');
            return;
        }
        if (current_version == null) {
            current_version = lastVersion();
            goVersion(current_version);
            return;
        }
    
        var v = parseInt(current_version);
        var l = parseInt(lastVersion());
        if (v < parseInt(l)) {
            goVersion(++v);
            current_version = v;
            return true;
        } else {
            return false;
        }
    }
    putStorageTracer = function (ver) {
        var isExplicit = checkExplicit(ver); //true or not
        var $new = $('<a class="storage-history-ver" data-history-ver="' + ver + '"  href="javascript: void(0);">' + ver + '</a>');
    
        $new.appendTo($('#version_tracer .storage-history'));
        if (isExplicit) {
            $new.addClass('storage-history-explicit');
        }
        $new.click(function () {
            event.stopPropagation();
            var v = $(this).data().historyVer;
            goVersion(v);
        
            //version number click;
            XFORM.template.loadToCanvas('', $('#canvas').html(), $('#canvas_js').val()); // [16-03-31] kimhs, js내용 파라미터 추가
        });
    
        var $del = $('<a class="delete-storage-item" style="display: none; margin:3px;" data-history-ver="' + ver + '" href="javascript: void(0);">[X]</a>');
        $new.after($del);
        $del.click(function () {
            event.stopPropagation();
            var ver = $(this).data().historyVer;
            var success = delStorageItem(ver);
            delStorageTracer(ver);
            if (success) XFORM.form.showStatus('정상적으로 삭제되었습니다');
        });
    }

    versionToKey = function (ver) {
        return getHistoryPrefix() + ver;
    }
    keyToVersion = function (key) {
        if (typeof key === 'undefined') {
            return;
        } else {
            return key.substr(getHistoryPrefix().length);
        }
    };

    tempSave = function (opt, message) {
        $('.history-save').click();
        var last_ver = lastVersion();
        if (opt == 'e') { //explicit save
            saveExplicit(last_ver);
            if(window.console) {
            	//console.log('explicit-' + last_ver);
            }
            reDraw();
            setCurrent(last_ver);
        }
        if (typeof message !== 'undefined') {
            if (message === 'default') {
                XFORM.form.alertTimeout('임시 저장되었습니다.');
            } else {
                XFORM.form.alertTimeout(message);
            }
            
        }
    }

    return {
        init: init,
        tempSave: tempSave,
        goVersion: goVersion,
        reDraw: reDraw,
        checkHistory : checkHistory,
        getAllVersion : getAllVersion,
        clearAllHistory: clearAllHistory,
        historyBack: historyBack,
        historyForward: historyForward
    };

}());
