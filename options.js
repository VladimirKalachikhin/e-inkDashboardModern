var defaultOptions = {
	// Хост и порт источника данных:
	// Backend host & port:
	//"gpsdProxyHost" : "127.0.0.1",
	"gpsdProxyHost" : "192.168.10.10",
	"gpsdProxyPort" : "3838",	// gpsdPROXY
	//"gpsdProxyHost" : "[::1]",
	//"gpsdProxyPort" : "3839",	// gpsdPROXY or gpsd2websocket
	// Клиентское устройство без органов управления:
	// Client device does not have any controls
	"kioskMode" : false,
	// Будет показываться как/где : величина gpsd
	// Will be displayed as/where : gpsd value
	"track" : "track",	// Путевой угол Course over ground
	//"track" : "magtrack", // Магнитный путевой угол Course over ground magnetic
	//"track" : "heading", // Курс Heading
	//"wangle" : "wanglem",	// Магнитный истинный ветер Wind angle magnetic
	"wangle" : "wangler",	// Вымпельный ветер Wind angle relative
	//"wangle" : "wanglet",	// Истинный ветер Wind angle true
	//"wangle" : false,	// не показывать ветер do not display Wind
	"nextPoint" : "nextPoint",	// Навигационная точка Navigation point
	"leftTopBlock" : "speed",	// Истинная скорость Speed over ground
	"rightTopBlock" : "depth",	// Глубина Water depth
	"leftBottomBlock" : "nextPoint",	// Температура воды Water temperature
	//"leftBottomBlock" : "wtemp",	// Температура воды Water temperature
	"rightBottomBlock" : "temp",	// Температура от сенсора (воздуха, обычно) Temperature at the sensor
	//"rightBottomBlock" : false,	// Ничего не показывать Do not display any value
};
