// Function to convert hex string to decimal considering endianness
function convertHexToDec(hexString, size) {
    var chunkArray = [];
    hexString = hexString.substring(0, size);

    for (var i = 0; i < size / 2; i++) {
        var subStr = hexString.substring(0, 2);
        hexString = hexString.substring(2);
        chunkArray.push(subStr);
    }

    if (hexString.length) {
        chunkArray.push(hexString);
    }

    var reversedHex = "";
    for (var j = chunkArray.length - 1; j >= 0; j--) {
        reversedHex += chunkArray[j];
    }

    return parseInt(reversedHex, 16);
}

// As we were using XPath in a previous preprocessing step, we don't have to deal with XML structure here.
// However, we have to skip certain parts of the hex string to get to the actual data.
value = value.substring(12); // Skip Header (schema.html:407)
value = value.substring(6);  // Skip Timestamp (schema.html:408)

var result = {};
var i, tempValue;

//Machinetype and Systemnumber
tempValue = convertHexToDec(value, 4);
value = value.substring(4);
result["Machinetype"] = tempValue;

tempValue = convertHexToDec(value, 4);
value = value.substring(4);
result["Systemnumber"] = tempValue;

// Temperatures (S1 bis S16)
for (i = 1; i <= 16; i++) {
    tempValue = convertHexToDec(value, 4);
    value = value.substring(4);

    if (tempValue > 32767) {
        tempValue -= 65536;
    }

    result["S" + i] = (tempValue / 10).toFixed(1);
}

// Throughput (S18 und S17) <- Actually S18 before S17
tempValue = convertHexToDec(value, 4);
value = value.substring(4);
result["S18"] = (tempValue / 10).toFixed(1);

tempValue = convertHexToDec(value, 4);
value = value.substring(4);
result["S17"] = tempValue.toFixed(1);

// AnalogIn (AI1 to AI3)
for (i = 1; i <= 3; i++) {
    tempValue = convertHexToDec(value, 4);
    value = value.substring(4);
    result["AI" + i] = (tempValue / 10).toFixed(1) + "V";
}

// AnalogOut (P1 to P4)
//for (i = 1; i <= 5; i++) {
for (i = 1; i <= 4; i++) {
    tempValue = convertHexToDec(value, 2);
    value = value.substring(2);
    result["P" + i] = tempValue === 0 ? "0" : "1";
}

// RoomSensors (RF1 to RF3)
for (i = 1; i <= 3; i++) {
    tempValue = convertHexToDec(value, 4);
    value = value.substring(4);

    if (tempValue > 32767) {
        tempValue -= 65536;
    }

    result["RF" + i] = (tempValue / 10).toFixed(1);
}

// Outputs (A1 to A14)
for (i = 1; i <= 14; i++) {
    tempValue = convertHexToDec(value, 2);
    value = value.substring(2);
    result["A" + i] = tempValue === 0 ? "0" : "1";
}

// Solar specific values
value = value.substring(16); // Skip 16 chars (schema.html:534)
tempValue = (convertHexToDec(value, 4)) * 1000;
value = value.substring(4);
result["SolarRevenue"] = tempValue;

value = value.substring(10); // Skip 10 chars (schema.html:545)
tempValue = convertHexToDec(value, 2);
value = value.substring(2);
result["P5"] = tempValue === 0 ? "0" : "1";

value = value.substring(18); // Skip 18 chars (schema.html:564)
tempValue = convertHexToDec(value, 4);
value = value.substring(4);
result["SolarPower"] = (tempValue / 10).toFixed(1);

// Return JSON-String (pretty print)
return JSON.stringify(result, null, 2);