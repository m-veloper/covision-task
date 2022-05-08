//결재선 JSON 오브젝트
//#1 - 결재선 데이터 준비
//var objApvList; //결재선 데이터

//#2 - 결재선에서 그래픽 데이터 추출
//var objNewApvList = ApvGraphicView.getGraphicData(objApvList);

//#3 - 클릭 이벤트 등록
//type 1 - 결재선 데이터를 data-apv-list attribute에 저장하는 방법
//$(클릭할 TD 태그).attr('data-apv-list', JSON.stringify(oNew));
//ApvGraphicView.toggle(this); //td 태그의 onclick에 연결

//type 2
//td 태그 클릭시 결재선 데이터를 인자로 전달하는 방법
//ApvGraphicView.toggle(this, objNewApvList);


var ApvGraphicView = {
  conf: {
    "serialDisplayAnimation": true,
    "jumpDisplayAnimation": true,
    "serialDisplayAnimationDelay": 300,
    "generalApprovalKindJump" : true,
    "debug": false
  },
  target: function($clicked){
    return $clicked.closest('tr').next();
  },
  hideSerialAnimate: function(lis){
    var delay = 0;
    var c = lis.length;

    for(var i=c-1; i>-1; i--){
      var $li = lis.eq(i);
      $li.queue('fade', function(next) {
        $li.delay(delay).fadeOut(500, next);
      });

      $li.dequeue('fade');
      delay += 60;
    }
  },
  showSerialAnimate: function(lis){
    var delay = 0;
    var me = this;

    lis.each(function() {
      var $li = $(this);
      $li.queue('fade', function(next) {
        $li.delay(delay).fadeIn(me.conf.serialDisplayAnimationDelay, next);
      });

      $li.dequeue('fade');
      delay += 80;
    });
  },
  show: function(that){
    var $clicked = $(that);
    var $target = this.target($clicked);

    $target.show(500);
    //animate all steps
    if(this.conf.serialDisplayAnimation) this.showSerialAnimate($('.steps li', $target));

    $clicked.addClass('apv-stat-open');

  },
  hide: function(that){
    var $clicked = $(that);
    var $target = this.target($clicked);

    if(this.conf.serialDisplayAnimation) this.hideSerialAnimate($('.steps li', $target));

    $target.hide(500);
    $clicked.removeClass('apv-stat-open');
  },
  toggle: function(that, viewData){
    var $clicked = $(that);
    var d = typeof viewData === 'undefined' ? $clicked.attr('data-apv-list') : viewData;
    //render apvlist
    if(!$clicked.hasClass('apv-stat-init')){
      this.init($clicked, d);
    }

    if($clicked.hasClass('apv-stat-open')){
      this.hide($clicked);
    }else{
      this.show($clicked);
    }
  },
  init: function ($clicked, viewData){
    var me = this;
    me.addTipCss(); //툴팁 css 추가

    //render apvlist
    var d = typeof viewData === 'object' ? viewData : JSON.parse(viewData);
    var t = $clicked.closest('tr').next().find('td');
    this.render(t, d);

    var $target = this.target($clicked);
    //animate all steps
    if(this.conf.serialDisplayAnimation) $('li', $target).hide();
    //hide exposed

    //nt
    $target.on('click', function(event){
      $('.tooltips', $(event.target)).removeClass('tooltips-show');
    });


    //var $initTarget = ApvGraphicView.conf.generalApprovalKindJump ? $('.para-step, .jump-step', $target) : $('.para-step', $target);
    var $initTarget = ApvGraphicView.conf.generalApprovalKindJump ? $('.para-step, .jump-step', $target).not('.para-step-dept') : $('.para-step', $target).not('.para-step-dept');
    $initTarget.each(function(){
      me.initStep($(this));
    });

    $('.para-step-dept', $target).each(function(){
      me.initDeptStep($(this));
    });

    $clicked.addClass('apv-stat-init');


  },
  initRender: function ($target, viewData, targetType){

    if($target.hasClass('apv-stat-init')) return;

    var me = this;
    me.addTipCss(); //툴팁 css 추가

    var d = typeof viewData === 'object' ? viewData : JSON.parse(viewData);
    me.render($target, d, targetType);

    //animate all steps
    if(me.conf.serialDisplayAnimation) $('li', $target).hide();

    //--- 일반/개인병렬.순차 결재선 펼침 이벤트
    var $initTarget = ApvGraphicView.conf.generalApprovalKindJump ? $('.para-step, .jump-step', $target).not('.para-step-dept') : $('.para-step', $target).not('.para-step-dept');
    $initTarget.each(function(){
      me.initStep($(this));
    });
    //--- 부서병렬.순차 결재선 펼침 이벤트
    $('.para-step-dept', $target).each(function(){
      me.initDeptStep($(this));
    });

    $target.addClass('apv-stat-init');

    $target.show(500);
    //animate all steps
    if(me.conf.serialDisplayAnimation) me.showSerialAnimate($('.steps li', $target));

    $target.addClass('apv-stat-open');
  },
  initStep: function ($step){
	//const CON_GAP = 3; //[IE 10 이하  const 사용 오류]
    var CON_GAP = 3;			// 선언 이외의 곳에서 값 변경 X
    var $substep = $('.substep', $step);
    var sub_count = $('.substep.badge-count', $step).length;
    var opt = {};

    opt['$subs'] = $substep;
    opt['$first'] = $substep.eq(0).addClass('first-step');
    opt['$badge'] = $('.badge', $step);
    opt['$stepkind'] = $('.stepkind', $step);
    opt['$badge'].html(sub_count);

    this.bindEvent(opt);

    //badge
    this.showParaSteps('badge', opt, true);

  },
  initDeptStep: function ($step){
    var me = this;
    var $stepkind = $('.stepkind', $step);

    $('.person-container', $step).on('click', function(){
      var $that = $(this);
      var innercode = $that.attr('data-apv-innercode');
      var $step = $that.parent();
      var $sameOu = $step.find('[data-apv-innercode=' + innercode  + ']').not('.person-container');
      var $diffOu = $step.find('.substep[data-apv-innercode!=' + innercode  + ']').not('.person-container');

      //$diffOu.hide();

      if($that.hasClass('inner-ou-expand')){
        $that.removeClass('inner-ou-expand');
        $sameOu.hide(500);

      }else{ //동일 ou의 person 표시
        $that.addClass('inner-ou-expand');
        $sameOu.show(500).addClass('substep-person');
      }
      var $jump = [];
      $jump.push($that);
      me.jumpAction($jump);

    });

    $stepkind.on('click', function(){
      $('.person-container', $step).trigger('click');
    });

    $step.find('.substep').not('.person-container').hide();
  },
  bindEvent: function(opt){
    var me = this;

    opt.$badge.on('click', badge_click);
    opt.$first.on('click', badge_click);
    opt.$stepkind.on('click', badge_click);

    function badge_click(){
      //배지 복원
      if(opt.$badge.attr('data-para-view') !== 'para-steps-badge'){
        me.showParaSteps('badge', opt);
      }else{
        var viewmode = 'expand';
        me.showParaSteps(viewmode, opt);
      }
    };

  },
  showParaSteps: function (viewmode, opt, waitonly){
    var me = this;
    var $subs = opt.$subs;
    var $first = opt.$first;
    var $badge = opt.$badge;
    var sub_count = $subs.length;

    $subs.find('li').show();
    //$('.comment', $subs).hide();
    $('.approve', $subs).hide();

    $('.consent-ok', $subs).remove();
    $('.consent-no', $subs).remove();

    var $para_step = $('.para-step');
    var para_type = '';

    if($para_step.hasClass('para-step-ordered')){
      para_type = 'order';
    } else if($para_step.hasClass('para-step-concurrent')){
      para_type = 'concurrent';
    } else {
      para_type = 'parallel';
    }

    if(sub_count == 1) {
      this.jump(para_type, $subs, waitonly);
    } else {
      if(viewmode==='badge'){
        $badge.attr('data-para-view', 'para-steps-badge');
        $subs.hide();
        $('.para-step .arrow').hide();
        $first.show();
        $first.find('li').eq(0).show();
        $badge.show();

        $('.substep-more').show();
      }else if(viewmode==='expand'){
        $badge.attr('data-para-view', 'para-steps-expand');

        $subs.show(300);
        $('.arrow').show(300);

        this.jump(para_type, $subs, waitonly);
      }
    }

  },
  jump: function(para_type, $subs, waitonly){

    if(!this.conf.jumpDisplayAnimation) return;

    var $jump=[];
    var deny =-1, yes = -1, wait = -1, inactive = -1;
    var waits = [], inactives = [];
    var me = this;

    $subs.each(function(i){
      var d = $(this).attr('data-apv-stat');
      if(d == 'no'){
        deny = i;
      } else if(d == 'wait'){
        wait = i;
        waits.push(wait);
      } else if(d == 'yes'){
        if(yes < 0) yes = i;
      } else if(d == 'inactive'){
        if(inactive < 0) inactive = i;
        inactives.push(i);
      }
    });

    if(para_type == 'order' || para_type == 'parallel') {
      if(waitonly) {
        if(wait > -1) {
          //$jump.push($subs.eq(wait));
          me.jumpAll(waits, $subs, $jump);
        }
      }else{
        if(wait > -1) {
          $jump.push($subs.eq(wait));
        } else if(deny > -1) {
          $jump.push($subs.eq(deny));
        } else if(yes > -1) {
          $jump.push($subs.eq(yes));
        } else if(inactive > -1) {
          //$jump.push($subs.eq(inactive));
          me.jumpAll(inactives, $subs, $jump);
        }
      }

    } else if(para_type == 'concurrent') {
      $jump.push($subs.eq(yes));
    } else {
      $jump.push($subs.eq(0));
    }

    this.jumpAction($jump);
  },
  jumpAll: function(arrJump, $subs, $jump){
    for(var w=0; w<arrJump.length;w++){
      $jump.push($subs.eq(arrJump[w]));
    }
  },
  jumpAction: function($jump){
    $.each($jump, function(){
      $(this).animate({top: '-20px'},200).animate({top: 0},200)
        .animate({top: '-10px'},200).animate({top: 0},200)
        .animate({top: '-5px'},200).animate({top: 0},200);
    });
  },
  getGraphicData: function (apvList, isSetPhoto) {
	
	// 기본값 true
	if(isSetPhoto == undefined)
		isSetPhoto = true;
	  
    var oApvList = JSON.parse(apvList);
    var $$_elmList = $$(oApvList).find("steps > division");
    var divisions = [];
    var me = this;

    $$_elmList.concat().each(function (index_div, $$_odiv) {
      var $$_osteps = $$_odiv.find("step").concat();
      var $$_ohiddensteps = $$_odiv.find("step > taskinfo[visible='n']");
      var hiddenStepsCount = $$_ohiddensteps.valLength();
      var steps=[];

      var objForPhotoPath = new Array();
      
      var stepslength = $$_osteps.length;
	  $$_osteps.each(function (index_step, $$_ostep) {
		  if($$_ostep.find("person>taskinfo").attr("visible") != "n" && $$_ostep.find("person>taskinfo").attr("kind") != "bypass"){
	        var step = {
	          divisiontype: $$_odiv.attr("divisiontype"),
	          allottype: $$_ostep.attr('allottype'),
	          unittype: $$_ostep.attr('unittype'),
	          routetype: $$_ostep.attr('routetype'),
	          substeps: []
	        };
	        
	        if($$_ostep.attr('unittype') == "person") {
	        	step["person_taskinfo_kind"] = $$_ostep.find("person>taskinfo").attr("kind");
	        }
	
	        step['kind'] = me.getStepTitle(step);
	
	        var $$_osteptaskinfo = $$_ostep.find("taskinfo");
	        if (!$$_osteptaskinfo.exist() || $$_osteptaskinfo.attr("visible") != 'n') {
	
	          var steproutetype = $$_ostep.attr("routetype");
	          var stepunittype = $$_ostep.attr("unittype");
	          var assureouvisible = false;
	
	          if (steproutetype == "notify") {
	            return;
	          } else {
	            if (stepunittype == "ou" && (steproutetype == "assist" || steproutetype == "consult" || steproutetype == "receive" || steproutetype == "audit")) {
	              assureouvisible = true;
	            }
	            if(index_div == 1 && stepslength == 1 && $$_ostep.find("role").length > 0){			// 담당업무함일 경우 부서처럼 처리
	            	assureouvisible = true;
	            }
	            var $$_oous = $$_ostep.find("ou");
	            var $$_ohiddenoous = $$_ostep.find("ou > taskinfo[visible='n']");
	
	            if(stepunittype == "ou" && ($$_oous.concat().length - $$_ohiddenoous.concat().length < 1)) {
	            	return false;
	            } else if(stepunittype == "person" && ($$_oous.find("person").concat().length - $$_oous.find("person > taskinfo[visible='n']").concat().length < 1)) {
	            	return false;
	            }
	            
	            $$_ostep.find("ou").concat().each(function (index_ou, $$_oou) {
	              var substep = {
	            	dpath:'',
	                photo:'',
	                name:'',
	                comment: "",
	                dept:'',
	                date: '',
	                state: '',
	                signImage: '',
	                substeps: []
	              };
	
	              var $$_ooutaskinfo = $$_oou.find(">taskinfo").length != 0 ? $$_oou.find(">taskinfo") : $$_oou.find("taskinfo");
	              var personRoleCount = $$_oou.find("person,role").valLength();
	              var $$_ohiddenpersons = $$_oou.find("person>taskinfo[visible='n'], role>taskinfo[visible='n']");
	              var hiddenPersonsCount = $$_ohiddenpersons.valLength();
	              var cntvisibleperson = personRoleCount - hiddenPersonsCount;

	              if (assureouvisible) {
	                var displayname = "";
	                var code = "";
	                var stepUnitType;
	
	                displayname = $$_oou.attr("name");
	                code = $$_oou.attr("code");
	
	                if ($$_oou.parent().nodename() == "step") {
	                  stepUnitType = $$_oou.parent().attr("unittype");
	                }
	
	                //substep['name'] = me.getDisplayName(displayname);
	                substep['name'] = CFN_GetDicInfo(me.getDisplayName(displayname));
	                substep['dept'] = '';
	                substep['date'] = me.getDate($$_ooutaskinfo);
	                substep['state'] = me.getState($$_ooutaskinfo);
	                
	                if(substep['state'] == 'wait'){
	                	substep['waitCircle'] = 'cirBlue';
	                }else if($$_ooutaskinfo.attr("result") == "rejected" && substep['state'] == 'no'){
	                	substep['waitCircle'] = 'cirRed';
	                }else{
	                	substep['waitCircle'] = 'cirCle';
	                }
	                
	                substep['comment'] = $$_ooutaskinfo.children('comment').text();
	                substep['code'] = code;
	                substep['photo'] = '';//me.getPhotoPath(code, stepUnitType);
	                substep['signImage'] = '';
	                substep['index_total'] = '';
	                substep['dpath'] = $$_oou.path();
	                
	                //내부 결재선
	                var persons = $$_oou.find("person, role").has("taskinfo[kind!=bypass]").concat();
	                var oSubsteps = me.getSubSteps(persons, step, index_div);
	                substep['position'] = '';
	                substep['substeps'] = substep['substeps'].concat(oSubsteps.substeps);
	
	                step.substeps.push(substep);
	
	                if(substep['state']=='wait') step.state = 'wait';
		            
	                objForPhotoPath.push({"code" : code, "stepUnitType" : stepUnitType});
	              } else {
	
	                var persons = $$_oou.find("person, role").has("taskinfo[kind!=bypass]").concat();
	
	                var oSubsteps = me.getSubSteps(persons, step, index_div);
	                if(oSubsteps.stepstate=='wait') step.state = 'wait';
	
	                step.substeps = step.substeps.concat(oSubsteps.substeps);
	              }
	            });
	          }
	        }
	        steps.push(step);
    	  }
		  
      });
      divisions.push({steps: steps});
    });
    
    // 사용자 프로필 이미지 한번에 조회하여 세팅
    if(isSetPhoto){
	    var userCodes = "";
	    var tempDivision = {};
	    $$(tempDivision).append("division", divisions);
	    var codeArr = $$(tempDivision).find("division").concat().find("steps").concat().find("substeps").concat().attr("code");
	    
	    if(codeArr.length > 0){
	    	$(codeArr).each(function(){
		    	userCodes += this + ";";
		    });
		    var photoPathObj = getProfileImagePath(userCodes);
		    $(photoPathObj).each(function(i, photo){
			    $$(tempDivision).find("division").concat().find("steps").concat().find("substeps[code="+photo.UserCode+"]").concat().each(function(j, substep){
			    	$$(substep).attr("photo", photo.PhotoPath);
			    });
		    });
	    }
    }
    
    if(this.conf.debug && window.console) {
      //console.log('apvList===>', apvList);
      //console.log('divisions===>', divisions);
    }


    return divisions;

  },
  getSubSteps: function($$_opersons, oStep, index_div){
    var me = this;
    var substeps = [];
    var stepstate = '';
    $$_opersons.each(function (index_person, $$_operson) {

      var index_total = index_div + 1;

      var $$_otaskinfo = $$_operson.find("taskinfo");

      if ($$_otaskinfo.attr("visible") != 'n' && $$_otaskinfo.attr("kind") != "conveyance") {			// 전달한 결재자 제외
        //get substep
        var substep = me.getSubStep($$_operson, $$_otaskinfo);
        substep['index_total'] = index_total;

        if(substep['state']=='wait') stepstate = 'wait';

        substeps.push(substep);
      }
    });

    return {
      substeps: substeps,
      stepstate: stepstate
    };
  },
  getSubStep: function($$_operson, $$_otaskinfo){

    var me = this;
    var substep = {
      dpath:'',
      photo:'',
      name:'',
      comment: "",
      dept:'',
      date: '',
      state: '',
      signImage: ''
    };
    var displayname = "", title = "", position = "", oudisplayname = "", code = "";

    substep["dpath"]=$$_operson.path();
    
    //role인경우 처리
    if ($$_otaskinfo.valLength() == 0) {
      $$_otaskinfo = $$_operson.parent().find("taskinfo");
      $$_operson = $$_operson.parent();
    }

    var oroleperson = null;
    if ($$_operson.nodename() == "role") {
      displayname = $$_operson.attr("name");
      oudisplayname = $$_operson.attr("ouname");
      code = $$_operson.attr("code");
    } else {
      displayname = $$_operson.attr("name");
      title = $$_operson.attr("title");
      position = $$_operson.attr("position");
      oudisplayname = $$_operson.attr("ouname");
      code = $$_operson.attr("code");
      
      if(position == undefined)
    	  position = ";";
    }

    var stepUnitType;
    if ($$_operson.parent().parent().nodename() == "step") {
      stepUnitType = $$_operson.parent().parent().attr("unittype");
    }
    // 그래픽 가져오기
    //substep['name'] = me.getDisplayName(displayname);
    substep['name'] = CFN_GetDicInfo(me.getDisplayName(displayname));
    substep['dept'] = CFN_GetDicInfo(oudisplayname);
    substep['title'] = title;
    if(position != undefined &&  position.split(";").length > 1) {
    	substep['position'] = position.split(";")[1]+"("+CFN_GetDicInfo(oudisplayname)+")";
    } else {
    	substep['position'] = "";
    }    
    substep['date'] = me.getDate($$_otaskinfo);
    substep['state'] = me.getState($$_otaskinfo);

    if(substep['state'] == 'wait'){
      substep['waitCircle'] = 'cirBlue';
    }else if($$_otaskinfo.attr("result") == "rejected" && substep['state'] == 'no'){
    	substep['waitCircle'] = 'cirRed';
    }else{
      substep['waitCircle'] = 'cirCle';
    }
    
    substep['comment'] = $$_otaskinfo.children('comment').text();
    substep['comment_fileinfo'] = $$_otaskinfo.find('comment_fileinfo').json();
    if(substep['comment'] ===null || substep['comment'] === undefined) substep['comment'] = '';
    if(substep['comment_fileinfo'] ===null || substep['comment_fileinfo'] === undefined) substep['comment_fileinfo'] = '';

    if(substep['comment'].trim() !== ''){
      substep['comment'] =  Base64.b64_to_utf8($$_otaskinfo.children("comment").text());
      substep['commentlink'] = '<a class="comment tooltips" href="javascript:void(0);" onclick="ApvGraphicView.showComment(event);">의견<span><div class="util-text-ellipsis" onclick="ApvGraphicView.showCommentDetail(event);">'+substep['comment']+'</div></span></a>';
    }else{
      substep['commentlink'] = '';
    }
    
    if(substep['comment_fileinfo'].length > 0){
    	g_commentAttachList.push($$_otaskinfo.children("comment_fileinfo").json());
        substep['commentlink'] += "<div class=\"fClip\" style=\"float: none; display: inline-block; height: 13px;\"><a class=\"mClip\" onclick='openFileList_comment(this,"+$$_operson.index().split("/")[0]+")'><spring:message code='Cache.lbl_attach'/></a></div>";
    }
    else {
    	g_commentAttachList.push({});
    }

    substep['code'] = code;
    substep['photo'] = '';//me.getPhotoPath(code, stepUnitType);
    substep['signImage'] = '';

    return substep;
  },
  render: function($target, viewData, targetType){
    var me = this;
    
    //[IE 10 이하  const 사용 오류]
    /*const CON_STEPS_HEADERR = '<div class=""><ul class="appProList steps">';
    const CON_STEPS_FOOTER = '</ul></div>';

    const CON_STEP_HEADER = '<li class="step jump-step"><div class="proTitGry"> <span class="titRoun stepkind">{{kind}}</span>';
    const CON_STEP_HEADER_WAIT = '<li class="step jump-step"><div class="proTitBlue"> <span class="titBRoun stepkind">{{kind}}</span>';
    const CON_STEP_PARA_HEADER = '<li class="lineApp step para-step"><div class="proBorder"><a class="cirNum badge" href="#">{{count}}</a><div class="proTitGry"> <span class="titRoun stepkind">{{kind}}</span>';
    const CON_STEP_SEQ_HEADER = '<li class="lineApp02 step para-step para-step-ordered"><div class="proBorder"><a class="cirNum badge" href="#">{{count}}</a><div class="proTitGry"> <span class="titRoun stepkind">{{kind}}</span>';

    const CON_STEP_PARA_FOOTER = '</div></div></li>';
    const CON_STEP_FOOTER = '</div></li>';
    const CON_STAT_OK_BASIC = 'cirOkFull';
    const CON_STAT_OK_PARA = 'cirOk';
    const CON_STAT_NO_BASIC = 'cirNonFull';
    const CON_STAT_NO_PARA = 'cirNon';
    const CON_STAT_PENDING = 'apv-state-pending';

    const CON_PARA_ARROW = '<div class="arrow">==&gt;</div>';
    const CON_SEQ_ARROW = '<div class="arrow">--&gt;</div>';
    const CON_ARROW = '<div class="arrow">&gt;</div>';
    const CON_PARA_MARK = '<div class="arrow">||</div>';*/
    
    
    // 선언 이외의 곳에서 값 변경 X
    var CON_STEPS_HEADERR = '<div class=""><ul class="appProList steps ' + (targetType == "account" ? 'appLtype02' : '') + '">';
    var CON_STEPS_FOOTER = '</ul></div>';

    var CON_STEP_HEADER = '<li class="step jump-step"><div class="proTitGry"> <span class="titRoun stepkind">{{kind}}</span>';
    var CON_STEP_HEADER_WAIT = '<li class="step jump-step"><div class="proTitBlue"> <span class="titBRoun stepkind">{{kind}}</span>';
    var CON_STEP_PARA_HEADER = '<li class="lineApp step para-step"><div class="proBorder"><a class="cirNum badge" href="#">{{count}}</a><div class="proTitGry"> <span class="titRoun stepkind">{{kind}}</span>';
    var CON_STEP_SEQ_HEADER = '<li class="lineApp02 step para-step para-step-ordered"><div class="proBorder"><a class="cirNum badge" href="#">{{count}}</a><div class="proTitGry"> <span class="titRoun stepkind">{{kind}}</span>';

    var CON_STEP_PARA_FOOTER = '</div></div></li>';
    var CON_STEP_FOOTER = '</div></li>';
    var CON_STAT_OK_BASIC = 'cirOkFull';
    var CON_STAT_OK_PARA = 'cirOk';
    var CON_STAT_NO_BASIC = 'cirNonFull';
    var CON_STAT_NO_PARA = 'cirNon';
    var CON_STAT_PENDING = 'apv-state-pending';

    var CON_PARA_ARROW = '<div class="arrow">==&gt;</div>';
    var CON_SEQ_ARROW = '<div class="arrow">--&gt;</div>';
    var CON_ARROW = '<div class="arrow">&gt;</div>';
    var CON_PARA_MARK = '<div class="arrow">||</div>';
    

    //모니터링에서 열었을 경우 onclick 함수 포함시킴
    var onclickStr = "";
    if(typeof onClickInMonitoring != "undefined"){
    	onclickStr = " onclick=\"onClickInMonitoring(this, '{{dpath}}');\"";
    }
    
    var tmpHtml = '';
    tmpHtml += '<dl class="icnNon substep {{badgeCount}}" data-apv-stat="{{state}}" data-apv-innercode={{substepsInnerCode}}>';
    if(targetType != "account") {
	    tmpHtml += '<dt'+onclickStr+'>';
	    tmpHtml += '<span class="{{waitCircle}}"><img src="{{photo}}" alt="" style="max-width: 100%; height: auto;" onerror="this.src=\''+ Common.getBaseConfig("ProfileImagePath")+'noimg.png\' "></span>'; //사진
	    tmpHtml += '<a class="state-icon {{stateIcon}}" href="#">{{state}}</a>'; //결재상태 아이콘
	    tmpHtml += '</dt>';
    }
    tmpHtml += '<dd>{{name}}&nbsp;{{position}}{{commentlink}}</dd>'; //이름
    tmpHtml += '<dd class="proDate">{{date}}</dd>'; //일자
    tmpHtml += '</dl>';

    var html = getRenderedHtml(viewData, tmpHtml);
    var $appended = $(html).appendTo($target);

    //person을 가진 ou
    $('.person-container', $appended).closest('.para-step').addClass('para-step-dept');

    $appended.find('.'+ CON_STAT_PENDING).remove();

    //---function---
    function _render(html, options){
      return me.templateEngine(html, options);
    }

    function bindTemplate(arrow, tmpHtml, substeps, step_kind, isSubPerson, innerCode){
      var h = '';
      for(var i=0; i<substeps.length; i++){
    	 
        substeps[i]['stateIcon'] = getStateIcon(step_kind, substeps[i].state);
        if(substeps[i].hasOwnProperty('substeps')){
          substeps[i]['badgeCount'] = 'person-container badge-count';
          substeps[i]['substepsInnerCode'] = substeps[i].code;
          h += (i>0 ?arrow :'') + _render(tmpHtml, substeps[i]);
          h += (i>0 ?arrow :'') + bindTemplate(arrow, tmpHtml, substeps[i]['substeps'], step_kind, true, substeps[i].code);
        }else{
          if(typeof isSubPerson === 'undefined' || !isSubPerson) {
            substeps[i]['badgeCount'] = 'badge-count';
          }else{
            substeps[i]['substepsInnerCode'] = innerCode;
          }
          h += (i>0 ?arrow :'') + _render(tmpHtml, substeps[i]);
        }

      }
      return h;
    }

    function getStateIcon(step_kind, state){
      var icon= CON_STAT_PENDING;
      //if(step_kind =='병렬합의' || step_kind =='순차합의' || step_kind =='병렬협조' || step_kind =='순차협조'){
      if(step_kind == coviDic.dicMap.lbl_apv_DeptConsent || step_kind == coviDic.dicMap.lbl_apv_DeptConsent_2
    		  || step_kind == coviDic.dicMap.lbl_apv_DeptAssist || step_kind == coviDic.dicMap.lbl_apv_DeptAssist2
    		  || step_kind == coviDic.dicMap.btn_apv_consultors || step_kind == coviDic.dicMap.btn_apv_consultors_2
    		  || step_kind == coviDic.dicMap.lbl_apv_assist || step_kind == coviDic.dicMap.lbl_apv_assist_2 ){
        if(state==='yes'){
          icon = CON_STAT_OK_PARA;
        }else if(state==='no'){
          icon = CON_STAT_NO_PARA;
        }
      }else{
        if(state==='yes'){
          icon = CON_STAT_OK_BASIC;
        }else if(state==='no'){
          icon = CON_STAT_NO_BASIC;
        }
      }
      return icon;
    }

    function getRenderedHtml(divisions, tmpHtml){
      var html = '';

      for(var i =0; i< divisions.length; i++){
        var division = divisions[i];
        var steps = division.steps;

        for(var j =0; j < steps.length; j++){
          var step = steps[j];
          var substeps = step.substeps;
          var step_arrow = "", arrow = "", header = "", footer = "";

          step['count'] = substeps.length;

          // 동시결재 조건 추가
          //if(step.kind =='병렬합의' || step.kind =='병렬협조' || step.allottype == "parallel"){
    	  if(step.kind == coviDic.dicMap.lbl_apv_DeptConsent_2 || step.kind == coviDic.dicMap.lbl_apv_DeptAssist2
        		  || step.kind == coviDic.dicMap.btn_apv_consultors_2 || step.kind == coviDic.dicMap.lbl_apv_assist_2 
        		  || step.allottype == "parallel"){
            step_arrow = CON_PARA_ARROW;
            arrow = CON_PARA_MARK;
            header = CON_STEP_PARA_HEADER;
            footer = CON_STEP_PARA_FOOTER;
          //}else if(step.kind =='순차합의' || step.kind =='순차협조'){
    	  }else if(step.kind == coviDic.dicMap.lbl_apv_DeptConsent || step.kind == coviDic.dicMap.lbl_apv_DeptAssist
        		  || step.kind == coviDic.dicMap.btn_apv_consultors || step.kind == coviDic.dicMap.lbl_apv_assist ){
            step_arrow = CON_SEQ_ARROW;
            arrow = CON_ARROW;
            header = CON_STEP_SEQ_HEADER;
            footer = CON_STEP_PARA_FOOTER;
          }else{
            step_arrow = CON_ARROW;
            arrow = CON_ARROW;
            header = step['state'] == 'wait' ? CON_STEP_HEADER_WAIT : CON_STEP_HEADER;
            footer = CON_STEP_FOOTER;
          }
          step_arrow = '';
          arrow = '';

          header = _render(header, step);
          var renderTempl = bindTemplate(arrow, tmpHtml, substeps, step.kind);

          html += (j > 0 ? step_arrow :'') +  header + renderTempl + footer;

        }
      }
      return CON_STEPS_HEADERR + html + CON_STEPS_FOOTER;

    }
  },
  /*getPhotoPath: function (code, stepUnitType){
	  //var photoPath = 'images/pic.jpg';
	  var photoPath = '';
	  if(ApvGraphicView.conf.debug) {
		  photoPath = 'images/pic.jpg';
	  }else{
		  if(stepUnitType === 'person' || stepUnitType === 'ou'){
			  photoPath = Common.getBaseConfig('ProfileImagePath',1)+code+".jpg";
		  } else {
			  photoPath = "/Images/Images/Approval/photo_group.gif"; //실제 경로에 없는 파일
		  }
	  }
	  
	  return photoPath;
  },*/
  getDisplayName: function (displayname){

    return displayname;
    //to-do: 다국어 처리
  },
  getState: function ($$_itemtaskinfo){
    var state = '';
    var result = $$_itemtaskinfo.attr('result');
    if(result === 'completed' || result === 'agreed'){
      state = 'yes';
    } else if(result === 'rejected' || result === 'disagreed'){
      state = 'no';
    } else if(result === 'pending' || result === 'reserved'){
      state = 'wait';
    } else {
      state = 'inactive';
    }
    return state;
  },
  getDate: function ($$_itemtaskinfo){
    //for debugging
    if (typeof $$_itemtaskinfo === 'undefined' ||
      $$_itemtaskinfo.attr("datecompleted") == "" ||
      $$_itemtaskinfo.attr("datecompleted") == null ||
      $$_itemtaskinfo.attr("datecompleted") == undefined) {
      return "";
    } else {
      return CFN_TransLocalTime($$_itemtaskinfo.attr("datecompleted"), "MM-dd HH:mm");
    }

    //@to-do - MM-DD hh/mm 형식 반환
  },
  //결재선 step 상단 표시명
  getStepTitle: function (step){
	// 한국어 하드코딩 => 다국어 처리
	  
    var namemap = {
      allottype: {
        serial : coviDic.dicMap.lbl_apv_serial, 						// 순차
        parallel : coviDic.dicMap.lbl_apv_parallel 						// 병렬
      },
      unittype: {
        ou : coviDic.dicMap.lbl_apv_dept, 								// 부서
        person: coviDic.dicMap.lbl_apv_person 							// 개인
      },
      routetype: {
    	approve : {
    		normal : coviDic.dicMap.lbl_apv_normalapprove,				// 일반결재
    		consent : coviDic.dicMap.lbl_apv_investigation,				// 검토
    		authorize : coviDic.dicMap.lbl_apv_authorize,				// 전결
    		substitute : coviDic.dicMap.lbl_apv_substitue,				// 대결
    		review : coviDic.dicMap.lbl_apv_review,						// 후결
    		bypass : coviDic.dicMap.lbl_apv_bypass,						// 후열
    		charge_send : coviDic.dicMap.lbl_apv_Draft,					// 기안
    		charge_receive : coviDic.dicMap.lbl_apv_receive,			// 수신
    		skip : coviDic.dicMap.lbl_apv_NoApprvl,						// 결재안함
    		confirm : coviDic.dicMap.lbl_apv_Confirm,					// 확인
    		reference : coviDic.dicMap.lbl_apv_share4list				// 참조
    	},
        consult : coviDic.dicMap.lbl_apv_tit_consent, 					// 합의
        receive : coviDic.dicMap.lbl_apv_Acceptdept, 					// 수신부서
        assist : coviDic.dicMap.lbl_apv_reject_consent, 				// 협조
        audit  : coviDic.dicMap.lbl_apv_audit, 							// 감사
        review  : coviDic.dicMap.lbl_apv_confirmor, 					// 공람
        
        // 부서
        serial_consult_ou : coviDic.dicMap.lbl_apv_DeptConsent, 		// 순차합의
        parallel_consult_ou : coviDic.dicMap.lbl_apv_DeptConsent_2, 	// 병렬합의
        serial_assist_ou : coviDic.dicMap.lbl_apv_DeptAssist, 			// 순차협조
        parallel_assist_ou : coviDic.dicMap.lbl_apv_DeptAssist2, 		// 병렬협조

        //감사,준법
        audit_ou : coviDic.dicMap.lbl_apv_dept_audit3, 					//감사
        audit_dept_law_ou : coviDic.dicMap.lbl_apv_dept_audit, 			//준법
        audit_person : coviDic.dicMap.btn_apv_person_audit, 			//감사
        audit_law_person : coviDic.dicMap.lbl_apv_person_audit1, 		//준법
        
        // 개인
        serial_consult_person : coviDic.dicMap.btn_apv_consultors, 		// 순차합의
        parallel_consult_person : coviDic.dicMap.btn_apv_consultors_2, 	// 병렬합의
        serial_assist_person : coviDic.dicMap.lbl_apv_assist, 			// 순차협조
        parallel_assist_person : coviDic.dicMap.lbl_apv_assist_2 		// 병렬협조
      }
    }

    var display = "";
    if(step.routetype == "approve") {
    	var person_taskinfo_kind;
    		
    	if(Array.isArray(step.person_taskinfo_kind)) {
    		person_taskinfo_kind = step.person_taskinfo_kind[0];
    	} else {
    		person_taskinfo_kind = step.person_taskinfo_kind;
    	}
    	
    	if(step.person_taskinfo_kind == "charge") {
        	display = namemap['routetype'][step.routetype][person_taskinfo_kind + "_" + step.divisiontype];
    	} else {
        	display = namemap['routetype'][step.routetype][person_taskinfo_kind];
    	}
    } else if(step.routetype == "consult" || step.routetype == "assist"){ // 합의, 협조인 경우
    	display = namemap['routetype'][step.allottype + "_" + step.routetype + "_" + step.unittype];
    } else if(step.routetype == "audit") {
    	if(step.name == undefined){
        	display = namemap['routetype'][step.routetype + "_" + step.unittype];
    	}else{
        	display = namemap['routetype'][step.name + "_" + step.unittype];
    	}
    } else {
    	display = namemap['routetype'][step.routetype];
    }
    
    return display;

  },
  showComment: function (event){
    event.stopPropagation();
    var $this = $(event.target);

    if($this.hasClass('tooltips-show')){
      $this.removeClass('tooltips-show');
    }else{
      $this.addClass('tooltips-show');
    }
  },
  showCommentDetail: function (event){
    event.stopPropagation();
    var $this = $(event.target);

    if($this.hasClass('util-text-ellipsis')){
      $this.removeClass('util-text-ellipsis');
      $this.parent().css("width", "auto");
    }else{
      $this.addClass('util-text-ellipsis');
      $this.parent().css("width", "140px");
    }
  },
  addTipCss: function (){
    var elStyle = document.createElement('style');
    elStyle.type = 'text/css';
    elStyle.innerHTML = this.getTipStyle();
    document.getElementsByTagName('head')[0].appendChild(elStyle);
  },
  getTipStyle: function(){
    var tooltips = 'a.tooltips{position:relative;display:inline-block}';
    var tooltips_span = 'a.tooltips span{position:absolute;width:140px;color:#FFF;background:#5A667A;min-height: 30px;line-height:22px;text-align:center;visibility:hidden;border-radius:6px;padding: 2px 8px;}';
    var tooltips_span_after = 'a.tooltips span:after{content:"";position:absolute;top:50%;right:100%;margin-top:-8px;width:0;height:0;border-right:8px solid #5A667A;border-top:8px solid transparent;border-bottom:8px solid transparent}';
    var tooltips_show_span = 'a.tooltips-show span{visibility:visible;opacity:.8;left:100%;top:50%;margin-top:-15px;margin-left:15px;z-index:999;text-indent: 0;}';
    var substep_ou = '.substep-ou { background-color: #DEDEDE } .substep-person { /*background-color: #EFEFEF;*/border-bottom: solid 2px #da7a7a;}';
    var styles = tooltips + tooltips_span +  tooltips_span_after + tooltips_show_span + substep_ou;
    return styles;
  },
  templateEngine: function (html, options) {
    var re = /{{(.+?)}}/g,
        reExp = /(^( )?(var|if|for|else|switch|case|break|{|}|;))(.*)?/g,
        code = 'with(obj) { var r=[];\n',
        cursor = 0,
        result,
        match;
    var add = function(line, js) {
      js? (code += line.match(reExp) ? line + '\n' : 'r.push(typeof ' + line + ' !== \'undefined\' ? ' + line + ': \'\'' + ');\n') :
      (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
      return add;
    }
    while(match = re.exec(html)) {
      add(html.slice(cursor, match.index))(match[1], true);
      cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code = (code + 'return r.join(""); }').replace(/[\r\t\n]/g, ' ');

    try { result = new Function('obj', code).apply(options, [options]); }
    catch(err) { console.error("'" + err.message + "'", " in \n\nCode:\n", code, "\n"); }
    return result;
  }
}

