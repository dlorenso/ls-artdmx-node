/**
 * Copyright (c) 2017 D. Dante Lorenso <dante@lorenso.com>.  All Rights Reserved.
 * This source file is subject to the MIT license that is bundled with this package
 * in the file LICENSE.txt.  It is also available at: https://opensource.org/licenses/MIT
 */

import ArtDmxClient = LarkSpark.ArtDmxClient;

let dmx = {
    bedroom: {red: 0, green: 0, blue: 0},
    living: {red: 0, green: 255, blue: 0}
};

let client = new ArtDmxClient('10.10.14.255', 6454);
client.broadcast([
    // bedroom
    dmx.bedroom.green, dmx.bedroom.red, dmx.bedroom.blue,

    // living room
    dmx.living.green, dmx.living.red, dmx.living.blue
]);

/*
 LightMouse LM-3R
 CURRENT STATUS
 Automatic IP Address (DHCP / ZeroConf): 10.10.14.168
 Automatic Subnet Mask (DHCP / ZeroConf): 255.255.255.0
 Manual IP Address: 2.1.3.121
 Manual Subnet Mask: 255.0.0.0
 MAC Address: 00-25-80-00-03-79
 Firmware Version: v 1.19.4
 */