# ls-artnet-node
## Art-Net Broadcast Client for TypeScript and Node JS

### Art-Net ArtDmx Client example

This project provides an ArtDmx Client written in TypeScript that will set DMX values to an ArtNet node
using UDP Broadcast.

```typescript
// ...

// create new artdmx client
let client = new ArtNetClient('10.10.14.255', 6454);

// broadcast our DMX values
client.broadcast([0, 0, 0, 255, 0, 128]);

```

### Written by
* D. Dante Lorenso <dante@lorenso.com>
