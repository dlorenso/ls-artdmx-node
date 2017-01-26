/**
 * Copyright (c) 2017 D. Dante Lorenso <dante@lorenso.com>.  All Rights Reserved.
 * This source file is subject to the MIT license that is bundled with this package
 * in the file LICENSE.txt.  It is also available at: https://opensource.org/licenses/MIT
 */
namespace LarkSpark {
    const dgram = require('dgram');

    export class ArtDmxClient {
        private readonly MIN_LENGTH = 16;
        private readonly PROTOCOL_VERSION:number = 14;

        // udp broadcast ip address
        private host:string = '2.255.255.255';

        // udp port number
        private port:number = 6454;

        // artnet dmx universe
        private universe:number = 0;

        /**
         * @param host
         * @param port
         * @param universe
         */
        constructor(host:string, port:number, universe:number = 0) {
            this.host = host;
            this.port = port;
            this.universe = universe;
        }

        /**
         *
         * @returns {Buffer}
         */
        public artDmxHeader():Buffer {
            let header = Buffer.alloc(12, 0); // 12 bytes (zeroed out)

            // id, opcode, protocol version
            header.write('Art-Net', 0, 8); // 0-7 ID (8 bytes)
            header.writeUInt16LE(0x5000, 8); // 8-9 Opcode = 0x5000 (ArtDmx data packet). Zero start code DMX512 info for single Universe.
            header.writeUInt16BE(this.PROTOCOL_VERSION, 10); // 10-11 ProtVer (Hi/Lo) = "14"

            // return header
            return header;
        }

        private artDmxPayload(dmx:number[]) {
            // init empty payload
            let len = Math.max(this.MIN_LENGTH, dmx.length);
            let payload = Buffer.alloc(len, 0);

            // apply dmx values to payload
            let index = 0;
            for (let value of dmx) {
                value = Math.min(Math.max(value, 0), 255); // insist in range 0-255
                payload.writeUInt8(value, index++);
            }

            // generate ARTDMX packet
            let artdmx = Buffer.alloc(6, 0);
            artdmx.writeUInt8(0, 0); // 0 Sequence = 0 (disabled)
            artdmx.writeUInt8(0, 1); // 1 Physical = 0 (informational only, use universe for routing)
            artdmx.writeUInt16BE(this.universe, 2); // 14-15 SubUni / Net
            artdmx.writeUInt16BE(payload.length, 4); // 16-17 Length Hi/Lo (length of DMX512 data, even number 2-512, # channels in packet)

            // assemble payload with artdmx
            return Buffer.concat([artdmx, payload]);
        }

        /**
         * @param dmx
         */
        public broadcast(dmx:number[]):void {
            console.log('dmx', dmx);

            // debugging
            console.log('host:', this.host, '| port:', this.port, '| universe:', this.universe);

            // header + payload
            let packet = Buffer.concat([this.artDmxHeader(), this.artDmxPayload(dmx)]);
            console.log('packet', packet);

            // create a new dgram socket
            let port = this.port;
            let host = this.host;

            // create a socket
            let sock = dgram.createSocket({type: 'udp4', reuseAddr: true});

            // socket error
            sock.on('error', (err) => {
                console.log('server error:', err);
                sock.close();
            });

            // bind connected
            sock.on('listening', () => {
                let address = sock.address();
                console.log('server listening:', address.address, ':', address.port);

                // we are broadcasting
                sock.setBroadcast(true);

                // broadcast the packet to the socket
                console.log('port', port, 'host', host);
                sock.send(packet, 0, packet.length, port, host);
                console.log('sent!', packet);

                // close socket
                sock.close();
            });

            // bind the udp source port
            sock.bind({port: this.port, address: '0.0.0.0', exclusive: true});
        }
    }
}