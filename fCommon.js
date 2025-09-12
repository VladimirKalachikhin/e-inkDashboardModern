/*
display()
displayON()
displayOFF()

realWindSymbolViewUpdate(speed=null)
upHline(posX)
downHline(posX)

MOBmessageInit()
MOBalarm()
closeMOBmessage()
sendMOBtoServer(status=true)

modeMenuInit()
selectOption(DOMid)
DOMidSelectionUpdOption(event)
modeMenuOpen()
modeMenuClose()
modeMenuReset()
modeMenuSubmit(event)

bigBlock(block,bigStyleName)
updBottomMessages()

bearing(latlng1, latlng2)
equirectangularDistance(from,to)

isBooblingFrom(event,id)

storageHandler
*/

function displayDataPopulate(options){
/**/
let headingDirection = false;
let displayData = {
	"position" : {	// это можно отдельно lon lat, и всё сложится, как с wangle и wspeed
		"gpsdClass": "TPV",
		"data" : null
	},
	"alarm" : {
		"gpsdClass": "ALARM",
		"gpsdType": "alarms",
		"data" : null
	},
	"nextPoint" : {	// 
		"gpsdClass": "WPT",
		"data" : null
	},
};

// Вся пурга с labelTemplate - для того, чтобы сперва загрузить английскую локализацию,
// и заполнить соответствующие строки, а потом, когда-нибудь (асинхронно, бля) - национальную.
// Что, в свою очередь, из-за дебильного CORS.
// А проблемы с CORS - потому, что я хочу, чтобы эту штуку можно было запускать, открыв файл в
// браузере, а не только с помощью веб-сервера.
if(options.track == 'magtrack'){
	displayData.track = {	// course over ground, путевой угол, track в gpsd
		"gpsdClass": "TPV",	// класс gpsd
		"gpsdType": "magtrack",	// свойство класса gpsd, конкретная величина
		"labelTemplate": "i18n.dashboardMagCourseTXT",	// наименование переменной из internationalisation.js
		"label" : i18n.dashboardMagCourseTXT,
		"precision": 0,	// точность показываемой цифры, символов после запятой
		"multiplicator": 1, 	// на что нужно умножить значение для показа
		"headingDirection": headingDirection,
		"data" : null
	};
	displayData.heading = {	// heading, курс
		"gpsdClass": "ATT",
		"gpsdType": "mheading",
		"labelTemplate": "i18n.dashboardMagHeadingTXT",	// наименование переменной из internationalisation.js
		"label" : i18n.dashboardMagHeadingTXT,
		"precision": 0,	// точность показываемой цифры, символов после запятой
		"multiplicator": 1, 	// на что нужно умножить значение для показа
		"headingDirection": headingDirection,
		"data" : null
	};
}
else if(options.track == 'heading'){
	headingDirection = true;
	displayData.track = {	// 
		"gpsdClass": "TPV",
		"gpsdType": "track",
		"labelTemplate": "i18n.dashboardCourseTXT",	// наименование переменной из internationalisation.js
		"label" : i18n.dashboardCourseTXT,
		"precision": 0,	// точность показываемой цифры, символов после запятой
		"multiplicator": 1, 	// на что нужно умножить значение для показа
		"headingDirection": headingDirection,
		"data" : null
	};
	displayData.heading = {	// heading, курс
		"gpsdClass": "ATT",
		"gpsdType": "heading",
		"labelTemplate": "i18n.dashboardHeadingTXT",	// наименование переменной из internationalisation.js
		"label" : i18n.dashboardHeadingTXT,
		"precision": 0,	// точность показываемой цифры, символов после запятой
		"multiplicator": 1, 	// на что нужно умножить значение для показа
		"headingDirection": headingDirection,
		"data" : null
	};
}
else {
	displayData.track = {	// course over ground, путевой угол, TPV track в gpsd
		"gpsdClass": "TPV",
		"gpsdType": "track",
		"labelTemplate": "i18n.dashboardCourseTXT",	// наименование переменной из internationalisation.js
		"label" : i18n.dashboardCourseTXT,
		"precision": 0,	// точность показываемой цифры, символов после запятой
		"multiplicator": 1, 	// на что нужно умножить значение для показа
		"headingDirection": headingDirection,
		"data" : null
	};
	displayData.heading = {	// heading, курс, в gpsd ATT heading
		"gpsdClass": "ATT",
		"gpsdType": "heading",
		"labelTemplate": "i18n.dashboardHeadingTXT",	// наименование переменной из internationalisation.js
		"label" : i18n.dashboardHeadingTXT,
		"precision": 0,	// точность показываемой цифры, символов после запятой
		"multiplicator": 1, 	// на что нужно умножить значение для показа
		"headingDirection": headingDirection,
		"data" : null
	};
};

let trueWind = false;
if(options.wangle == 'wanglem'){	// Wind angle magnetic
	// только если курс или путевой угол магнитный
	if(options.track == 'magtrack'){
		trueWind = true;
		displayData.wangle = {
			"gpsdClass": "ATT",
			"gpsdType": "wanglem",
			"labelTemplate": "",
			"label" : "",
			"precision" : 0,
			"multiplicator" : 1,
			"trueWind": trueWind,
			"data" : null
		};
		displayData.wspeed = {
			"gpsdClass": "ATT",
			"gpsdType": "wspeedt",
			"labelTemplate": "i18n.dashboardTrueWindSpeedTXT+', '+i18n.dashboardWindSpeedMesTXT+':'",
			"label" : i18n.dashboardTrueWindSpeedTXT+', '+i18n.dashboardWindSpeedMesTXT+':',
			"precision" : 1,
			"multiplicator" : 1,
			"data" : null
		};
	};
}
else if(options.wangle == 'wanglet'){	// Wind angle true
	trueWind = true;
	displayData.wangle = {
		"gpsdClass": "ATT",
		"gpsdType": "wanglet",
		"labelTemplate": "",
		"label" : "",
		"precision" : 0,
		"multiplicator" : 1,
		"trueWind": trueWind,
		"data" : null
	};
	displayData.wspeed = {
		"gpsdClass": "ATT",
		"gpsdType": "wspeedt",
		"labelTemplate": "i18n.dashboardTrueWindSpeedTXT+', '+i18n.dashboardWindSpeedMesTXT+':'",
		"label" : i18n.dashboardTrueWindSpeedTXT+', '+i18n.dashboardWindSpeedMesTXT+':',
		"precision" : 1,
		"multiplicator" : 1,
		"data" : null
	};
}
else{	// Wind angle relative
	displayData.wangle = {
		"gpsdClass": "ATT",
		"gpsdType": "wangler",
		"labelTemplate": "",
		"label" : "",
		"precision" : 0,
		"multiplicator" : 1,
		"trueWind": trueWind,
		"data" : null
	};
	displayData.wspeed = {
		"gpsdClass": "ATT",
		"gpsdType": "wspeedr",
		"labelTemplate": "i18n.dashboardWindSpeedTXT+', '+i18n.dashboardWindSpeedMesTXT+':'",
		"label" : i18n.dashboardWindSpeedTXT+', '+i18n.dashboardWindSpeedMesTXT+':',
		"precision" : 0,
		"multiplicator" : 1,
		"data" : null
	};
	if(options.wangle === false || options.wangle === 'false' || options.wangle === 'none'){	// указано не показывать эту величину
		displayData.wangle.data = false;
		displayData.wspeed.data = false;
	};
};

/* Углы экрана */
/* Left top value */
if(options.leftTopBlock) buildOptions(displayData, options.leftTopBlock,'leftTopBlock');	// используя javascript, я становлюсь дебилом. Правильно, конечно, displayData=buildOptions(displayData...
/* Right top value */
if(options.rightTopBlock) buildOptions(displayData, options.rightTopBlock,'rightTopBlock');
/* Left bottom value */
if(options.leftBottomBlock) buildOptions(displayData, options.leftBottomBlock,'leftBottomBlock');
/* Right bottom value */
if(options.rightBottomBlock) buildOptions(displayData, options.rightBottomBlock,'rightBottomBlock');

return displayData;
}; // end function displayDataPopulate


function buildOptions(displayData,option,DOMid=null){
/* величины для показа в углах экрана */
if(option === false || option === 'false' || option === 'none') return;	// указано не показывать в этом углу
switch(option){
case 'speed':	// Speed over ground
	displayData.speed = {
		"gpsdClass": "TPV",
		"gpsdType": "speed",
		"labelTemplate": "i18n.dashboardSpeedTXT+', '+i18n.dashboardSpeedMesTXT",	// скорость
		"label" : i18n.dashboardSpeedTXT+', '+i18n.dashboardSpeedMesTXT,
		"precision" : 1,
		"multiplicator" : 60*60/1000,
		"DOMid": DOMid,
		"data" : null
	};
	break;
case 'depth':	// Только одна глубина, потому что приходит уже исправленная глубина, и неизвестно, в какую сторону.
	displayData.depth = {
		"gpsdClass": "ATT",
		"gpsdType": "depth",
		"labelTemplate": "i18n.dashboardDepthTXT+', '+i18n.dashboardDepthMesTXT", 	// глубина
		"label" : i18n.dashboardDepthTXT+', '+i18n.dashboardDepthMesTXT,
		"precision" : 1,
		"multiplicator" : 1,
		"DOMid": DOMid,
		"data" : null
	};
	break;
case 'temp':	// температура воздуха
	displayData.airTemperature = {
		"gpsdClass": "ATT",
		"gpsdType": "temp",
		"labelTemplate": "i18n.dashboarAirTemperatureTXT+', '+i18n.dashboardTemperatureMesTXT",
		"label" : i18n.dashboarAirTemperatureTXT+', '+i18n.dashboardTemperatureMesTXT,
		"precision" : 0,
		"DOMid": DOMid,
		"data" : null
	};
	break;
case 'wtemp':	// температура воды
	displayData.waterTemperature = {
		"gpsdClass": "ATT",
		"gpsdType": "wtemp",
		"labelTemplate": "i18n.dashboarWaterTemperatureTXT+', '+i18n.dashboardTemperatureMesTXT",
		"label" : i18n.dashboarWaterTemperatureTXT+', '+i18n.dashboardTemperatureMesTXT,
		"precision" : 0,
		"DOMid": DOMid,
		"data" : null
	};
	break;
case "nextPoint":
	displayData.nextPoint.labelTemplate = "i18n.dashboarNextPointTXT";
	displayData.nextPoint.label = i18n.dashboarNextPointTXT;
	displayData.nextPoint.DOMid = DOMid;
	break;
/*case 'speedr': // speed Through Water. Отсутствует в gpsd
	displayData.speed = {
		"gpsdClass": "TPV",
		"gpsdType": "speedr",
		"labelTemplate": "i18n.dashboardVaterSpeedTXT+', '+i18n.dashboardSpeedMesTXT",	// скорость
		"label" : i18n.dashboardVaterSpeedTXT+', '+i18n.dashboardSpeedMesTXT,
		"precision" : 1,
		"multiplicator" : 60*60/1000,
		"DOMid": DOMid,
		"data" : null
	};
	break;
case 'depthBS':	// depth below Surface.  Отсутствует в gpsd.
	displayData.depth = {
		"gpsdClass": "ATT",
		"gpsdType": "depthBS",
		"labelTemplate": "i18n.dashboardDepthTXT+', '+i18n.dashboardDepthMesTXT", 	// глубина
		"label" : i18n.dashboardDepthTXT+', '+i18n.dashboardDepthMesTXT,
		"precision" : 1,
		"multiplicator" : 1,
		"DOMid": DOMid,
		"data" : null
	};
	break;
case 'depthBK':	// depth below Keel.  Отсутствует в gpsd, но можно сделать в gpsdPROXY?
	displayData.depth = {
		"gpsdClass": "ATT",
		"gpsdType": "depthBK",
		"labelTemplate": "i18n.dashboardKeelDepthTXT+", "+i18n.dashboardDepthMesTXT", 	// глубина
		"label" : i18n.dashboardKeelDepthTXT+", "+i18n.dashboardDepthMesTXT,
		"precision" : 1,
		"multiplicator" : 1,
		"DOMid": DOMid,
		"data" : null
	};
	break;
case 'depth':	// depth below Transducer.
	displayData.depth = {
		"gpsdClass": "ATT",
		"gpsdType": "depth",
		"labelTemplate": "i18n.dashboardTransDepthTXT+', '+i18n.dashboardDepthMesTXT", 	// глубина
		"label" : i18n.dashboardTransDepthTXT+', '+i18n.dashboardDepthMesTXT,
		"precision" : 1,
		"multiplicator" : 1,
		"DOMid": DOMid,
		"data" : null
	};
	break;
case 'airP':	// давление воздуха.  Отсутствует в gpsd.
	displayData.airPressure = {
		"gpsdClass": "ATT",
		"gpsdType": "airP",
		"labelTemplate": "i18n.dashboarAirPressureTXT+', '+i18n.dashboardAirPressureMesTXT",
		"label" : i18n.dashboarAirPressureTXT+', '+i18n.dashboardAirPressureMesTXT,
		"precision" : 0,
		"multiplicator" : 0.01,
		"DOMid": DOMid,
		"data" : null
	};
	break;
case 'airH':	// влажность  Отсутствует в gpsd
	displayData.airHumidity = {
		"gpsdClass": "ATT",
		"gpsdType": "airH",
		"labelTemplate": "i18n.dashboarAirHumidityTXT+', '+i18n.dashboardAirHumidityMesTXT",
		"label" : i18n.dashboarAirHumidityTXT+', '+i18n.dashboardAirHumidityMesTXT,
		"precision" : 0,
		"DOMid": DOMid,
		"data" : null
	};
	break;*/
};
// А не будем здесь делать return ничего, потому что я дурак, а дураки пишут на javascript
}; // 		end function buildOptions


function internalisationApply() {
/*
Global i18n i18nLocal
*/
// английские названия загружаются из файла internationalisation/en.js перед загрузкой этого скрипта.
// Они всегда есть, и полные.
i18n = i18nLocal;	// все строки находятся в переменной i18nLocal в файле internationalisation/en.js
// Поищем национальные названия
let i18nFileNames = navigator.language.split(',').map((l)=>l.split(';')[0]);
// Здесь игнорируются двойные локали (en-US), поэтому американскую локализацию сделать нельзя. Удмуртскую тоже.
i18nFileNames = Array.from(new Set(i18nFileNames.map((l)=>l.split('-')[0].toLowerCase())));	// unique через set
//console.log('[internalisationApply] navigator.language=',navigator.language,'i18nFileNames:',i18nFileNames);

getI18nData();

function getI18nData(){
/* Вся эта горбатая пурга - исключительно потому, что CORS запрещает загрузку объекта
по протоколу file://
Т.е., если бы было как в e-inkDashboardModernSK, то при открытии файла index.html браузером
файл интернационализации не загрузился бы из-за запрета от CORS.
Поэтому, для поддержки использования без веб-сервера, сделано так через жопу.
*/
//console.log('[getI18nData] i18nLocal:',i18nLocal,'i18nFileNames:',i18nFileNames);
let i18nFileName = i18nFileNames.shift();
//if(!i18nFileName) return;
i18nFileName = 'internationalisation/'+i18nFileName+'.js';
//console.log('[getI18nData] i18nFileName=',i18nFileName);

let internationalisationStringsScript = document.createElement('script');
internationalisationStringsScript.onerror = () => {
	console.log("not found internationalisation file",i18nFileName);
	internationalisationStringsScript.remove();
	getI18nData();
};
internationalisationStringsScript.onload = () => {
	console.log("The internationalisation file",i18nFileName,"is loaded.");
	//console.log('[internationalisationStringsScript.onload] i18nLocal:',i18nLocal);
	for(let varName in i18n){	// присвоим имеющимся переменным национальные значения
		if(i18nLocal[varName]) i18n[varName] = i18nLocal[varName];
	};
	displayDataInternationalisation();	// перепишем национализированные значения в displayData
	MOBmessageInit();	// Окно сообщения MOB
	modeMenuInit();	// Окно меню параметров
	displayOFF();
};
internationalisationStringsScript.src = i18nFileName;
document.head.appendChild(internationalisationStringsScript);	// Это, собственно, и вызовет загрузку. При этом скрипт переместится в конец списка скриптов. И что?
//console.log('[getI18nData] internationalisationStringsScript:',internationalisationStringsScript);
}; // end function getI18nData

}; // end function internalisationApply


function displayDataInternationalisation(){
/* Переписывает строки в displayData по текущему состоянию i18n
*/
for(let displayName in displayData){
	displayData[displayName].label = eval(displayData[displayName].labelTemplate);
};
}; // end function displayDataInternationalisation












function updMOBposition(from,to){
const mobDist = equirectangularDistance(from,to);
//console.log('[display] mobPosition:',mobPosition,'mobDist=',mobDist);
// Расстояние до MOB в левом нижнем углу
leftBottomBlock.style.display = '';
leftBottomBlock.innerHTML = `${mobDist.toFixed()}<span style="font-size:var(--ltl1-font-size);"><br>${i18n.dashboardMOBalarmTXT}, ${i18n.dashboardAlarmDistanceMesTXT}</span>`;
leftBottomBlock.classList.add('leftBottomFrameBlinker');
}; // end function updMOBposition


function display(gpsdClass=null){
/* Функция, которая показвает картинку 

Global displayData mobPosition
*/
//console.log('[display] gpsdClass=',gpsdClass);
//if(!gpsdClass) {	// выключим всё и нарисуем что есть. Оно мигает, если там координаты протухли. оно и без вполне
//	displayOFF();
//	displayON();
//};
let str='',htmlBLock;
let gpsdType;
//console.log('[display] displayData:',displayData);
for(let displayName in displayData){
	if(displayData[displayName].gpsdClass != gpsdClass) continue;
	switch(displayName){
	case 'position':
		if(!displayData.position.data) break;
		// обновляем расстояние до MOB
		if(mobPosition) updMOBposition(displayData.position.data,mobPosition);
		// рисуем всё про путевую точку.
		if((displayData.nextPoint.data != null) && (displayData.nextPoint.data.lat != null) && (displayData.nextPoint.data.lon != null)) {
			displayNextPoint();	
		};
		break;
	/* Рисование круга */
	case 'track':
		compassMessage.style.display = 'none';
		if(displayData.track.data === null) {	// данных для рисования круга нет, но всё равно нужно показывать картушку, даже если нет направления, потому что на ней может показываться ветер и MOB
			compassCard.style.transform = `rotate(0deg)`;
			center_icon.style.display = 'none';
			compassMessage.innerHTML = `<span class="blink" style="font-size:3em;">?</span>`;
			compassMessage.style.display = '';
			topMessage.innerHTML = `${displayData.track.label} ?`;
		}
		else {	// данные для рисования круга есть
			center_icon.style.display = '';
			if(displayData.track.headingDirection) {
				if(displayData.heading.data != null) {	// если оно магнитное, то и heading там - магнитный
					center_marc.style.transform = `rotate(${displayData.track.data-displayData.heading.data}deg)`;
				}
				else{	// heading может внезапно исчезнуть или протухнуть, поэтому картушку надо вернуть
					//console.log('no heading, but must be. center_marc.style.transform=',center_marc.style.transform)
					if(center_marc.style.transform && center_marc.style.transform != 'none'){
						center_marc.style.transform = 'none';
					};
				};
			};
			compassCard.style.transform = `rotate(${360-displayData.track.data}deg)`;
			topMessage.innerHTML = `${displayData.track.label} ${displayData.track.data.toFixed(displayData.track.precision)}°`;
		};
		if(mobPosition && displayData.position.data) {
			const mobBearing = bearing(displayData.position.data,mobPosition);
			mobMark.style.display = '';
			mobMark.style.transform = `rotate(${mobBearing}deg)`;
		};
		break;
	case 'heading':
		if(displayData.heading.data === null) {
			if(center_icon.style.transform && center_icon.style.transform != 'none'){
				center_icon.style.transform = 'none';
			};
			delete bottomMessages.heading;
			updBottomMessages();	// показывает нижнее сообщение
		}
		else {
			if(displayData.heading.headingDirection) {
				if(center_icon.style.transform && center_icon.style.transform != 'none'){
					center_icon.style.transform = 'none';
				};
			}
			else {
				if(displayData.track.data !== null) {
					center_icon.style.transform = `rotate(${displayData.heading.data-displayData.track.data}deg)`;
				}
			}
			bottomMessages.heading = `${displayData.heading.label} ${displayData.heading.data.toFixed(displayData.heading.precision)}°`;
			updBottomMessages();	// показывает нижнее сообщение
		};
		break;
	case 'wangle':
	//case 'wspeed':	// нахрена два раза? Они одновременно приходят. Но - для концептуальности.
		//console.log('[display] displayData.wangle.data=',displayData.wangle.data,displayData.wspeed.data);
		if(displayData.wangle.data === null || displayData.wspeed.data === null || displayData.wangle.data === false || displayData.wspeed.data === false) {	// ветра нет или не велено показывать
			realWindSymbolViewUpdate(null);
			delete bottomMessages.wspeed;
			updBottomMessages();	// показывает нижнее сообщение
		}
		else {
			//console.log('[display] displayData.wangle.data=',displayData.wangle.data,displayData.wspeed.data);
			windSVGimage.setAttribute("transform", `rotate(${displayData.wangle.data-90})`);	// исходно картинка горизонтальная, я ветер считается от center_icon
			realWindSymbolViewUpdate(displayData.wspeed.data);
			bottomMessages.wspeed = `${displayData.wspeed.label} ${displayData.wspeed.data.toFixed(displayData.wspeed.precision)}`;
			updBottomMessages();	// показывает нижнее сообщение
		};
		break;
	case 'alarm':
		//console.log('recieved ALARM data',JSON.stringify(displayData.alarm.data,null,"\t"));
		for(const alarmType in displayData.alarm.data){
			switch(alarmType){
			case 'MOB': //
				//console.log('[display] in mob data:',JSON.stringify(displayData.alarm.data[alarmType],null,"\t"));
				if(displayData.alarm.data.MOB.status){	// режим MOB есть
					//console.log('mob:',JSON.stringify(displayData.alarm.data.MOB,null,"\t"));
					mobPosition=null;	// если режим есть, и пришло что-то новое, значит, старое неактуально?
					for(const point of displayData.alarm.data.MOB.points){
						if(!point.current) continue;
						if(point.coordinates[0] != null && point.coordinates[1] != null){	// По тем или иным причинам может быть точка без координат
							mobPosition = {'longitude': point.coordinates[0],'latitude': point.coordinates[1]};
						};
						break;
					};
					//console.log('The MOB is raised, mobPosition:',mobPosition);
				}
				else {	// режима MOB нет
					mobPosition = null;
					leftBottomBlock.innerHTML = '';
					leftBottomBlock.classList.remove('leftBottomFrameBlinker');
					mobMark.style.display = 'none';
				}; //
				break;
			case 'collisions':
				//console.log('recieved ALARM collisions data',JSON.stringify(displayData.alarm.data.collisions,null,"\t"));
				// Вообще-то, хотелось бы чтобы когда-нибудь указывалась опасность столкновения
				// не только с судами. Но пока у нас только цели AIS.
				//console.log('Уберём имеющиеся стрелки',collisionArrows.children.length)
				collisionArrows.innerHTML = '';
				rightBottomBlock.innerHTML = '';
				//console.log('осталось',collisionArrows.children.length)
				//console.log('collisions:',displayData.alarm.data.collisions);
				if(displayData.alarm.data.collisions.length !== 0){	// есть состояние collision, пришли новые данные. В этом случае displayData.alarm.data.collisions - объект, и свойства .length не имеет.
					//console.log('есть состояние collision, пришли новые данные collisions:',displayData.alarm.data.collisions);
					let collisions = Object.entries(displayData.alarm.data.collisions).sort(function(a,b){return a[1].dist - b[1].dist;});	// сортировка по дистанции, collisions - массив массивов из двух элементов, первый - бывший ключ (mmsi), второй - бывшее значение {lat:,lon:,dist:}
					//console.log('sorted collisions:',collisions);
					let minDist=Math.floor(collisions[0][1].dist+1),maxDist,step;
					if(collisions.length > 1){
						minDist = Math.floor(collisions[1][1].dist);
						maxDist = Math.floor(collisions[collisions.length-1][1].dist)+1;
						step = (maxDist-minDist)/4;
					}
					//console.log('minDist=',minDist,'maxDist=',maxDist,'step=',step);
					let nearestDist = 0;
					for(let collision of collisions){
						const arrow = collisionArrow.cloneNode(true);
						arrow.id = collision[0];
						collisionArrows.appendChild(arrow);
						arrow.style.display = null;
						arrow.style.transform = `rotate(${collision[1].bearing}deg)`;
						//console.log(arrow);
						if(collision[1].dist <= minDist) {
							//console.log('Ближайший');
							nearestDist = collision[1].dist
						}
						else if((collision[1].dist > minDist) && (collision[1].dist <= (minDist+step))) {
							//console.log('Близкий');
							arrow.style.width = 'var(--collisionArrowWidthNormal)';
							arrow.style.left = 'var(--collisionArrowLeftNormal)';
						}
						else if((collision[1].dist > (minDist+step)) && (collision[1].dist <= (minDist+2*step))) {
							//console.log('Средний');
							arrow.style.width = 'var(--collisionArrowWidthSmall)';
							arrow.style.left = 'var(--collisionArrowLeftSmall)';
						}
						else {
							//console.log('Дальний');
							arrow.style.width = 'var(--collisionArrowWidthLitle)';
							arrow.style.left = 'var(--collisionArrowLeftLitle)';
						}
						//console.log('tpv collisions',collision[1].dist);
					}
					// Расстояние до ближайшей опасности в правом нижнем углу
					rightBottomBlock.style.display = '';
					if(nearestDist>=1000) nearestDist = Math.round(nearestDist/100)*100;
					else if(nearestDist>=100) nearestDist = Math.round(nearestDist/10)*10;
					rightBottomBlock.innerHTML = `${nearestDist.toFixed(0)}<span style="font-size:var(--ltl1-font-size);"><br>${i18n.dashboardCollisionAlarmTXT}, ${i18n.dashboardAlarmDistanceMesTXT}</span>`;
					rightBottomBlock.classList.add('rightBottomFrameBlinker');
				}
				else {	// состояние collision прекратилось
					//console.log('состояние collision прекратилось collisions:',displayData.alarm.data.collisions.length,displayData.alarm.data.collisions);
					rightBottomBlock.classList.remove('rightBottomFrameBlinker');
				};
				break;
			};
		};
		break;
	case 'nextPoint':
		//console.log('recieved WPT data',JSON.stringify(displayData.nextPoint,null,"\t"));
		// не должны изменяться углы, если есть особые режимы: MOB и опасность столкновения
		if(!displayData[displayName].DOMid) break;	// данный параметр запрошен, но не должен показываться
		if((displayData[displayName].data==null) || (displayData.nextPoint.data.lat==null) || (displayData.nextPoint.data.lon==null)){	// координат путевой точки нет
			nextPointDirection.style.display = 'none';	// выключим указатель
			if((displayData[displayName].DOMid == 'leftBottomBlock') && mobPosition) break;	// не будем рисовать в нижнем левом углу, если режим MOB
			if((displayData[displayName].DOMid == 'rightBottomBlock') && displayData.alarm.data && displayData.alarm.data.collisions) break;	// не будем рисовать в нижнем правом углу, если опасность столкновения
			if(displayData[displayName].DOMid) document.getElementById(displayData[displayName].DOMid).style.display = 'none';
		}
		else{	// координаты путевой точки есть
			if(displayData.position.data) displayNextPoint();	// если есть и свои координаты - рисуем всё про путевую точку.
		};
		break;
	case 'speed':
	case 'depth':
	case 'airTemperature':
	//case 'airPressure':
	//case 'airHumidity':
	case 'waterTemperature':
	default:
		if(!displayData[displayName].DOMid) break;	// данный параметр запрошен, но не должен показываться
		if((displayData[displayName].DOMid == 'leftBottomBlock') && mobPosition) break;	// не будем рисовать в нижнем левом углу, если режим MOB
		if((displayData[displayName].DOMid == 'rightBottomBlock') && displayData.alarm.data && displayData.alarm.data.collisions) break;	// не будем рисовать в нижнем правом углу, если опасность столкновения
		//console.log('[display] displayName:',displayName,JSON.stringify(displayData[displayName],null,"\t"));
		htmlBLock = document.getElementById(displayData[displayName].DOMid);
		if(displayData[displayName].data === null || displayData[displayName].data === false) {	// мог быть вызов display для всех величин -- для обновления экрана
			htmlBLock.style.display = 'none';	// чтобы и события отключить
			break;
		}
		if(displayData[displayName].DOMid.includes('ottom')) {	// указано размещать в нижних углах
			str += displayData[displayName].data.toFixed(displayData[displayName].precision);			
			if(displayData[displayName].label) str += `<span style="font-size:var(--ltl1-font-size);"><br>${displayData[displayName].label}</span>`;
		}
		else {
			if(displayData[displayName].label) str += `<span style="font-size:var(--ltl1-font-size);">${displayData[displayName].label}<br><br></span>`;
			str += displayData[displayName].data.toFixed(displayData[displayName].precision);			
		}
		htmlBLock.style.display = '';
		htmlBLock.innerHTML = str;
	};
};

	function displayNextPoint(){
	const azimuth = bearing(displayData.position.data, displayData.nextPoint.data);
	//console.log('[displayNextPoint] azimuth=',azimuth);
	nextPointDirection.style.transform = `rotate(${azimuth}deg)`;
	nextPointDirection.style.display = '';

	if(!displayData.nextPoint.DOMid) return;	// данный параметр запрошен, но не должен показываться
	if((displayData.nextPoint.DOMid == 'leftBottomBlock') && mobPosition) return;	// не будем рисовать в нижнем левом углу, если режим MOB
	if((displayData.nextPoint.DOMid == 'rightBottomBlock') && tpv.collisions && tpv.collisions.value) return;	// не будем рисовать в нижнем правом углу, если опасность столкновения

	let dist = equirectangularDistance(displayData.position.data, displayData.nextPoint.data);
	//console.log('[displayNextPoint] dist=',dist);
	let mesTXT;
	if(dist>1000){ 
		dist = (dist/1000).toFixed(displayData.nextPoint.precision+1);
		mesTXT = i18n.dashboarNextPointMesKMTXT;
	}
	else {
		dist = dist.toFixed(displayData.nextPoint.precision);
		mesTXT = i18n.dashboarNextPointMesMTXT;
	}

	const htmlBLock = document.getElementById(displayData.nextPoint.DOMid);
	let str='';
	if(displayData.nextPoint.DOMid.includes('ottom')) {	// указано размещать в нижних углах
		str += dist;			
		if(displayData.nextPoint.label) str += `<span style="font-size:var(--ltl1-font-size);"><br>${displayData.nextPoint.label}, ${mesTXT}</span>`;
	}
	else {
		if(displayData.nextPoint.label) str += `<span style="font-size:var(--ltl1-font-size);">${displayData.nextPoint.label}, ${mesTXT}<br><br></span>`;
		str += dist;			
	}
	htmlBLock.style.display = '';
	htmlBLock.innerHTML = str;
	}; // 	end function displayNextPoint
}; // end function display()


function displayON(){
/* включает отображение обычных элементов экрана, и выключает отображение сообщения */
console.log('[displayON]');

center_marc.style.display = '';
topMessage.style.display = '';
bottomMessage.style.display = '';
center_icon.style.display = '';
if(options.kioskMode){	// клинтское устройство без органов управления
	modeMenuIcon.style.display = 'none';
	mobButton.style.display = 'none';
}
else {
	modeMenuIcon.style.display = '';
	if(gpsdPROXYbackend) mobButton.style.display = '';
};
compassMessage.style.display = 'none';
}; // end function displayON


function displayOFF(){
/* выключает отображение обычных элементов экрана, и включает отображение сообщения */
console.log('[displayOFF]');

center_marc.style.display = 'none';
topMessage.style.display = 'none';
bottomMessage.style.display = 'none';
center_icon.style.display = 'none';
leftTopBlock.style.display = 'none';	// чтобы и события отключить
rightTopBlock.style.display = 'none';
rightBottomBlock.style.display = 'none';
leftBottomBlock.style.display = 'none';
mobButton.style.display = 'none';

compassMessage.innerHTML = `<span><br><br>${i18n.dashboardGNSSoldTXT}</span>`;
compassMessage.style.display = 'contents';	// Не знаю, почему это так, но если указать пусто - текст вообще не показывается.
}; // end function displayOFF


var oldWind = {'w25cnt': null,'w5cnt': null,'w2dt5cnt': null,'direction': null};

function realWindSymbolViewUpdate(speed=null){
/* Изменяет внешний вид символа ветра от данной скорости ветра. 
Но не поворачивает.
*/
// Символ
let windSVG = document.getElementById('windSVGimage');
if(!windSVG) return;	// картинка там как-то не сразу появляется
//console.log('[realWindSymbolViewUpdate]','speed=',speed,'windSVG:',windSVG);
let windMark = windSVG.getElementById('wMark');

if(speed === null){
	while (windMark.firstChild) {	// удалим все символы из значка
		windMark.removeChild(windMark.firstChild);
	};
	oldWind.w25cnt = null; oldWind.w5cnt = null; oldWind.w2dt5cnt = null;
	return;
}

let posX=0, stepX=hbl.x2.baseVal.value, stepY=bLine.points[2].y-bLine.points[1].y;
//console.log('stepX=',stepX,'stepY=',stepY);
posX += bLine.points[0].x;

//console.log('[realWindSymbolViewUpdate] wind speed=',speed);
let w25cnt = Math.floor(speed/25);	// перо 25 м/сек
speed -= w25cnt * 25;
if(w25cnt) w25cnt = 1;	// одно перо. Не будем показывать фантастические скорости

let w5cnt = Math.floor(speed/5);	// перья 5 м/сек
speed -= w5cnt * 5;

let w2dt5cnt = Math.floor((speed*10)/25)
//console.log('speed=',speed,'w25cnt=',w25cnt,'w5cnt=',w5cnt,'w2dt5cnt=',w2dt5cnt);

if(oldWind.w25cnt == w25cnt && oldWind.w5cnt == w5cnt && oldWind.w2dt5cnt == w2dt5cnt) return;	// Вид стрелки не изменился

//console.log('Вид стрелки изменился -- перерисовываем');
oldWind.w25cnt = w25cnt; oldWind.w5cnt = w5cnt; oldWind.w2dt5cnt = w2dt5cnt;

while (windMark.firstChild) {	// удалим все символы из значка
	windMark.removeChild(windMark.firstChild);
}
// стрелка
windMark.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'use'));
windMark.lastChild.setAttribute('x','0');
windMark.lastChild.setAttribute('y','0');
windMark.lastChild.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href','#bLine');

//console.log('Перед половинным пером posX=',posX);
if(w2dt5cnt) {	// половинное перо
	// рисуем верхнюю линию Вообще-то, её длина должна быть равна w2dt5.points[3].x, но в данном случае мы просто вставляем hbl
	windMark.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'use'));
	windMark.lastChild.setAttribute('x',String(posX));
	windMark.lastChild.setAttribute('y',0);
	windMark.lastChild.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href','#hbl');
	// рисуем перо
	windMark.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'use'));
	windMark.lastChild.setAttribute('x',String(posX));
	windMark.lastChild.setAttribute('y',String(stepY));
	windMark.lastChild.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href','#w2dt5');
	posX += w2dt5.points[3].x;
	// рисуем продолжение
	upHline(posX);	// рисуем верхнюю соединительную линию, запоминать новое posX не надо
	posX = downHline(posX);	// рисуем нижнюю соединительную линию
}
//console.log('После половинного пера posX=',posX);

for(let i=w5cnt; i--;){	// рисуем перья 5 м/сек
	// рисуем верхнюю линию
	windMark.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'use'));
	windMark.lastChild.setAttribute('x',String(posX));
	windMark.lastChild.setAttribute('y',0);
	windMark.lastChild.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href','#hbl');
	// рисуем перо
	windMark.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'use'));
	windMark.lastChild.setAttribute('x',String(posX));
	windMark.lastChild.setAttribute('y',String(stepY));
	windMark.lastChild.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href','#w5');
	posX += w5.points[3].x;
	// рисуем продолжение
	if(i != 0){
		upHline(posX);	// рисуем верхнюю соединительную линию, запоминать новое posX не надо
		posX = downHline(posX);	// рисуем нижнюю соединительную линию
	}
	//console.log('posX=',posX,windMark);
}
//console.log('После 5 м/сек перьев posX=',posX);

for(let i=w25cnt; i--;){	// рисуем перья 25 м/сек
	upHline(posX);	// рисуем верхнюю соединительную линию, запоминать новое posX не надо
	posX = downHline(posX);	// рисуем нижнюю соединительную линию
	// рисуем верхнюю линию Она должна быть длиной с ширину w25
	windMark.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'line'));
	windMark.lastChild.setAttribute('x1',String(posX));
	windMark.lastChild.setAttribute('y1',2);
	windMark.lastChild.setAttribute('x2',String(posX+w25.points[2].x));
	windMark.lastChild.setAttribute('y2',2);
	// рисуем перо
	windMark.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'use'));
	windMark.lastChild.setAttribute('x',String(posX));
	windMark.lastChild.setAttribute('y',String(stepY));
	windMark.lastChild.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href','#w25');
	posX += w25.points[2].x;
}
//console.log('После 25 м/сек перьев posX=',posX);

// рисуем завершающую вертикальную линию
windMark.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'use'));
windMark.lastChild.setAttribute('x',String(posX));
windMark.lastChild.setAttribute('y',0);
windMark.lastChild.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href','#vbl');
//console.log('posX=',posX);


function upHline(posX){
for( let i=2; i--; ){
	windMark.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'use'));
	windMark.lastChild.setAttribute('x',String(posX));
	windMark.lastChild.setAttribute('y',0);
	windMark.lastChild.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href','#hbl');
	posX += hbl.x2.baseVal.value;
};
return posX;
}; //end function upHline
function downHline(posX){
for( let i=2; i--; ){
	windMark.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'use'));
	windMark.lastChild.setAttribute('x',String(posX));
	windMark.lastChild.setAttribute('y',String(bLine.points[2].y-bLine.points[1].y));
	windMark.lastChild.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href','#hbl');
	posX += hbl.x2.baseVal.value;
};
return posX;
}; //end function downHline
}; // end function realWindSymbolViewUpdate

function MOBmessageInit(){
/* Окно сообщения MOB */
MOBmessage.style.display = 'none';
MOBmessageAddPointButton.querySelector('span').innerHTML = i18n.dashboardMOBbuttonAddTXT;
MOBmessageCancelButton.querySelector('span').innerHTML = i18n.dashboardMOBbuttonCancelTXT;

}; // end function MOBmessageInit

function MOBalarm(){
/* Global mobPosition */
if((displayData.alarm.data.MOB != null) && displayData.alarm.data.MOB.status){	// режим MOB есть
	MOBmessageAddPointButton.style.display = '';
	MOBmessage.style.display = '';
	document.body.addEventListener('click',(event)=>{closeMOBmessage();},{'once':true});
}
else {
	MOBmessage.style.display = 'none';
	sendMOBtoServer(true);	
};
}; // end function MOBalarm

function closeMOBmessage(){
MOBmessage.style.display = 'none';
} // end function closeMOBmessage


function sendMOBtoServer(status=true){
/* Global: displayData, socket */
//console.log("[sendMOBtoServer] status=",status,'displayData.position.data:',displayData.position.data);
if(status) {	// нужно открыть режим "человек за бортом"
	// Есть координаты
	let coordinates = [];	// если нет координат, то Leaflet такую точку просто не показывает.
	if(displayData.position.data) coordinates = [displayData.position.data.longitude,displayData.position.data.latitude];

	if((displayData.alarm.data.MOB != null) && displayData.alarm.data.MOB.status){	// Режим MOB уже есть, имеются данные MOB, надо добавить ещё одну точку
		displayData.alarm.data.MOB.points.push({
			"coordinates": coordinates,
			"current": true,
			"safety_related_text": ""
		});
	}
	else {	// Режима MOB нет, надо создать с единственной точкой. Если там были какие-то чужие точки - это их проблемы.
		displayData.alarm.data.MOB = {
			"class": 'MOB',
			"points": [
				{
					"coordinates": coordinates,
					"current": true,
					"safety_related_text": ""
				}
			],
		};
	};
};
// иначе - нужно закрыть режим MOB - тогда просто укажем. Точки оставим как есть.
displayData.alarm.data.MOB.status = status;
displayData.alarm.data.MOB.timestamp = Math.round(Date.now()/1000);
if(socket.readyState == 1) {
	//console.log('[sendMOBtoServer] отсылается на сервер:','?UPDATE={"updates":['+JSON.stringify(displayData.alarm.data.MOB)+']};');
	socket.send('?UPDATE={"updates":['+JSON.stringify(displayData.alarm.data.MOB)+']};');
}
else{	// но если некуда отсылать - забудем обо всём
	delete displayData.alarm.data.MOB;
};
}; // end function sendMOBtoServer




// Меню параметров
function modeMenuInit(){
/* Окно меню параметров */
modeMenu.style.display = 'none';
let selected=false;
// Путевой угол
courseTypeSelector.labels[0].innerHTML = `${i18n.courseTypeSelectorLabelTXT}`;
courseTypeSelector.options.length = 0;
for(let option in i18n.courseTypeSelectorOptionsTXT){
	if(displayData.track && displayData.track.gpsdType == option) selected=true;
	else selected=false;
	courseTypeSelector.add(new Option(i18n.courseTypeSelectorOptionsTXT[option], option,selected,selected));
};
// Ветер
windTypeSelector.labels[0].innerHTML = `${i18n.windTypeSelectorLabelTXT}`;
windTypeSelector.options.length = 0;
for(let option in i18n.windTypeSelectorOptionsTXT){
	if(displayData.wangle && displayData.wangle.gpsdType == option) selected=true;
	else selected=false;
	windTypeSelector.add(new Option(i18n.windTypeSelectorOptionsTXT[option], option,selected,selected));
};
// Углы
let DOMid = modeMenu.querySelector('input[name="DOMidSelection"]:checked').value;	// выбранный угол
let tpvName;
for(tpvName in displayData){
	if(displayData[tpvName].DOMid != DOMid) {
		tpvName = null;
		continue;
	}
	break;
};
//console.log('[modeMenuInit] DOMid=',DOMid,'tpvName=',tpvName);
modeSelector.labels[0].innerHTML = `${i18n.modeSelectorLabelTXT}`;
modeSelector.options.length = 0;
for(let option in i18n.modeSelectorOptionsTXT){
	//console.log('[modeMenuInit] option=',option,i18n.modeSelectorOptionsTXT[option]);
	//if(option.startsWith('Engine')) {
		//if(!displayData.propulsionPaths) continue;
		//if(option.includes('1') && displayData.propLabel0.value) i18n.modeSelectorOptionsTXT[option] = i18n.modeSelectorOptionsTXT[option].replace('1',displayData.propLabel0.value);
		//else if(option.includes('2') && displayData.propLabel1.value) i18n.modeSelectorOptionsTXT[option] = i18n.modeSelectorOptionsTXT[option].replace('2',displayData.propLabel1.value);
	//};
	if(tpvName && ((displayData[tpvName].gpsdType == option) || (displayData[tpvName].gpsdClass == option))) selected=true;
	else selected=false;
	modeSelector.add(new Option(i18n.modeSelectorOptionsTXT[option], option,selected,selected));
};
resetToDefaultButton.value = i18n.resetToDefaultButtonTXT;

}; // end function modeMenuInit

function selectOption(DOMid){
let tpvName;
for(tpvName in displayData){
	if(displayData[tpvName].DOMid != DOMid) {
		tpvName = null;
		continue;
	}
	break;
};
//console.log('[selectOption] DOMid=',DOMid,'tpvName=',tpvName);
if(tpvName){
	for(const option of modeSelector.options){
		if((option.value != displayData[tpvName].gpsdType) && (option.value != displayData[tpvName].gpsdClass)) continue;
		option.selected = true;
		break;
	};
}
else modeSelector.selectedIndex = 0;
}; // end function selectOption

function DOMidSelectionUpdOption(event){
selectOption(event.target.value);
}; // end function DOMidSelectionUpdOption

function modeMenuOpen(){
if(modeMenu.style.display == 'none'){
	//console.log('[modeMenuOpen] modeMenu:',modeMenu);
	modeMenu.style.display = '';
	document.body.addEventListener('click',(event)=>{
		//console.log(event.target,event.currentTarget);
		//console.log('Проходит через modeMenu:',isBooblingFrom(event,'modeMenu'));
		// В этом кретинском языке нет нормального способа узнать, через какие объекты всплывает событие,
		// и нет способа запретить всплытие событий через объект.
		// Поэтому костыль.
		//if(!isBooblingFrom(event,'modeMenu')) modeMenuClose();
		// Но мы обойдёмся без костыля, рекомендованными методами: запретом
		// всплытия по клику на соответствующем объекте.
		modeMenuClose();
	},{'once':true});	// закрывать меню по клику в любом месте
}
else modeMenu.style.display = 'none';
}; // end function modeMenuOpen

function modeMenuClose(){
modeMenu.style.display = 'none';
}; // end function modeMenuClose

function modeMenuReset(){
/* Global: displayData options */
storageHandler.del('displayData');
displayData = displayDataPopulate(options);	// options - in options.js
//console.log('[modeMenuSubmit] displayData:',displayData);
//displayOFF();	// убрать всё с экрана
//displayON();	// вернуть экран обратно
modeMenuClose();
modeMenuInit();	
}; // end function modeMenuReset

function modeMenuSubmit(event){
/* GLobal: options */
//console.log('[modeMenuSubmit]',event);
//console.log('[modeMenuSubmit] courseTypeSelector',courseTypeSelector.value,);
//console.log('[modeMenuSubmit] windTypeSelector',windTypeSelector.value,);
//console.log('[modeMenuSubmit] DOMidSelection',modeMenu.querySelector('input[name="DOMidSelection"]:checked').value);
//console.log('[modeMenuSubmit] modeSelector',modeSelector.value,);
let useroptions = options	//  options - in options.js
useroptions.track = courseTypeSelector.value;
useroptions.wangle = windTypeSelector.value;
useroptions[modeMenu.querySelector('input[name="DOMidSelection"]:checked').value] = modeSelector.value;
displayData = displayDataPopulate(useroptions);	//
//console.log('[modeMenuSubmit] displayData:',displayData);
displayOFF();	// убрать всё с экрана
displayON();	// вернуть экран обратно
storageHandler.save('displayData');
//console.log('[modeMenuSubmit] displayData saved:',storageHandler.restore('displayData'));
modeMenuClose();	// оно не надо, поскольку окно перегружается
event.preventDefault(); // Prevent form submission, окно не перегружается
//alert('[modeMenuSubmit]');
}; // end function modeMenuSubmit

// Конец Меню параметров


function bigBlock(block,bigStyleName){
/**/
block.classList.toggle(bigStyleName);
if(leftTopBlock.classList.contains("leftTopBlockBig")
|| rightTopBlock.classList.contains("rightTopBlockBig")
|| leftBottomBlock.classList.contains("leftBottomBlockBig")
|| rightBottomBlock.classList.contains("rightBottomBlockBig")
) compass.classList.add("opa");
else compass.classList.remove("opa");
} // end function bigBlock

function updBottomMessages(){
// В этом кретинском языке у пустого объекта нет функции .keys(), и если bottomMessages пуст, 
// bottomMessages.keys() обломится с Uncaught TypeError: bottomMessages.keys is not a function
if(!Object.keys(bottomMessages).length) {
	bottomMessage.style.display = 'none';
	return;
}
bottomMessage.innerHTML = '';
for(let key in bottomMessages) {
	bottomMessage.innerHTML += ' '+bottomMessages[key];
};
bottomMessage.style.display = '';
};// end function updBottomMessages


function bearing(latlng1, latlng2) {
/* возвращает азимут c точки 1 на точку 2 */
//console.log(latlng1,latlng2)
const rad = Math.PI/180;
let lat1,lat2,lon1,lon2;
if(latlng1.lat) lat1 = latlng1.lat * rad;
else lat1 = latlng1.latitude * rad;
if(latlng2.lat) lat2 = latlng2.lat * rad;
else lat2 = latlng2.latitude * rad;
if(latlng1.lng) lon1 = latlng1.lng * rad;
else if(latlng1.lon) lon1 = latlng1.lon * rad;
else lon1 = latlng1.longitude * rad;
if(latlng2.lng) lon2 = latlng2.lng * rad;
else if(latlng2.lon) lon2 = latlng2.lon * rad;
else lon2 = latlng2.longitude * rad;
//console.log('lat1=',lat1,'lat2=',lat2,'lon1=',lon1,'lon2=',lon2)

let y = Math.sin(lon2 - lon1) * Math.cos(lat2);
let x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
//console.log('x',x,'y',y)

let bearing = ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
if(bearing >= 360) bearing = bearing-360;

return bearing;
} // end function bearing

function equirectangularDistance(fromIn,toIn){
// https://www.movable-type.co.uk/scripts/latlong.html
// from,to: {longitude: xx, latitude: xx}
let from = {};
if(fromIn.lat) from.latitude = fromIn.lat;
else if(fromIn.latitude) from.latitude = fromIn.latitude
if(fromIn.lon) from.longitude = fromIn.lon;
else if(fromIn.lng) from.longitude = fromIn.lng
else if(fromIn.longitude) from.longitude = fromIn.longitude

let to = {};
if(toIn.lat) to.latitude = toIn.lat;
else if(toIn.latitude) to.latitude = toIn.latitude
if(toIn.lon) to.longitude = toIn.lon;
else if(toIn.lng) to.longitude = toIn.lng
else if(toIn.longitude) to.longitude = toIn.longitude

const rad = Math.PI/180;
const φ1 = from.latitude * rad;
const φ2 = to.latitude * rad;
const Δλ = (to.longitude-from.longitude) * rad;
const R = 6371e3;	// метров
const x = Δλ * Math.cos((φ1+φ2)/2);
const y = (φ2-φ1);
const d = Math.sqrt(x*x + y*y) * R;	// метров
return d;
} // end function equirectangularDistance

/*
function isBooblingFrom(event,id){
// Проверяет, всплывает ли событие event через объект с id 
//Нужно, чтобы объект, на котором зарегистрировано событие, тоже имел id
//
if(event.target.id == id) return true;	// событие вызвано собственно на искомом объекте
let currentTargetID = event.currentTarget.id;
if(!currentTargetID) return null;
let current = event.target.parentElement;
do{
	if(!current) return false;
	if(current.id == currentTargetID) return false;
	if(current.id == id) return true;
	current = current.parentElement;
} while(true);
}; // end function isBooblingFrom
*/

const storageHandler = {
	_storageName : 'DashboardModernOptions',
	_store: {'empty':true},	// типа, флаг, что ещё не считывали из хранилища. Так проще и быстрей в этом кривом языке.
	storage: false,	// теоретически, можно указать, куда именно записывать? Но только мимо проверки доступности.
	//storage: 'cookie',
	//storage: 'storage',
	save: function(key,value=null){
		/* сохраняет key->value, но можно передать список пар одним параметром 
		или просто строку с именем переменной */
		let values = {};
		if(arguments.length == 2){	// два аргумента - это key->value
			values[key] = value;
		}
		else if(typeof key == 'object') {	// один, но список key->value
			values = key;
		}
		else {	// один, тогда это строка - имя переменной
			//values[key] = window[key];	// это обломается, если key - не глобальная переменная, объявленная через var
			// поэтому нижесказанное - единственный способ получить значение объекта по его имени.
			// Он сработает и с локальным объектом, и с объектами, объявленными через let и const
			values[key] = eval(key);
			//console.log('[storageHandler] save key=',key,window[key]);
		};
		//console.log('[storageHandler] save',values,'to storage:',this.storage,'store:',this._store);
		for(let key in values){
			this._store[key] = values[key];
		};
		this._store.empty = false;
		this._saveStore();
	},
	restore: function(key){
		//alert('[storageHandler] restore '+key);
		if(this._store.empty){
			this._restoreStore();
			this._store.empty = false;
		};
		return this._store[key.trim()];
	},
	restoreAll: function(){
		if(this._store.empty){
			this._restoreStore();
			this._store.empty = false;
		};
		delete this._store.empty;
		for(let varName in this._store){
			window[varName] = this._store[varName];	// window[varName] - создаётся глобальная переменная с именем, являющимся значением varName
		};
		this._store.empty = false;
	},
	del: function(key){
		if(this._store.empty){
			this._restoreStore();
			this._store.empty = false;
		};
		delete this._store[key.trim()];
		this._saveStore();
	},
	_findStorage: function(){
		try {
			window.localStorage.setItem("__storage_test__", "__storage_test__");
			window.localStorage.removeItem("__storage_test__");
			this.storage='storage';
		}
		catch (err) {
			this.storage='cookie';	// куки-то всегда можно, да?
		};
	},
	_saveStore: function(){
		if(!this.storage) this._findStorage();
		switch(this.storage){
		case 'storage':
			//console.log('_saveStore:',JSON.stringify(this._store));
			window.localStorage.setItem(this._storageName, JSON.stringify(this._store));
			break;
		case 'cookie':
			let expires = new Date(Date.now() + (60*24*60*60*1000));	// протухнет через два месяца
			expires = expires.toUTCString();
			document.cookie = this._storageName+"="+JSON.stringify(this._store)+"; expires="+expires+"; path=/; SameSite=Lax;";
			break;
		default:
			console.log('storageHandler: the parameters are not saved, there is nowhere');
		};
	},
	_restoreStore: function(){
		if(!this.storage) this._findStorage();
		switch(this.storage){
		case 'storage':
			this._store = JSON.parse(window.localStorage.getItem(this._storageName));
			//console.log('_restoreStore:',JSON.stringify(this._store));
			if(!this._store) this._store = {'empty':true};
			break;
		case 'cookie':
			this._store = JSON.parse(document.cookie.match(new RegExp(
				"(?:^|; )" + this._storageName.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
			))[1]);
			if(!this._store) this._store = {'empty':true};
			break;
		default:
			console.log('storageHandler: no saved parameters, there is nowhere');
		};
	}
}; // end storageHandler

