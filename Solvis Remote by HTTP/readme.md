# Template: Solvis Remote by HTTP
## Sources
For my research the following sources were helpful:
  - Code from http://$your-solvis-remote-ip$/schema.html
  - The sensor description from https://solvis-files.s3.eu-central-1.amazonaws.com/downloads-fk/solvisben/29434_ALS-BEN.pdf (Page 43)
  - The output from http://$your-solvis-remote-ip$/sc2_val.xml, which is basically the source of our data.
## In-depth analysis of the sc2_val.xml
When calling the URL, after doing a digest-authentification, you'll receive the following response:
```xml
<xml>
<data>HHHHHHHHHHHHTTTTTTMMMMSSSS79027701980134022E02820193026F02A2FE0F00C4090302C409C4096400C40900000000000000000000132B19000000000000000000640000000000000000640000515D34E900007A2EBC4C04040103010000000201010000CD300F0075190C1A6FD800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000</data>
</xml>
```
> [!NOTE]
> For privacy reasons I've masked the Header (12 chars long -> H), the time (6 chars long -> T), the machine type (4 chars long -> M) and the system number (4 chars long -> S) already.

For us only the text inside the <data>-node is important. Based on the code of schema.html we can then match the chars to the specific sensors:
```
HHHHHHHHHHHH TTTTTT MMMM SSSS 7902 7701 9801 3402 2E02 8201 9302 6F02 A2FE 0F00 C409 0302 C409 C409 6400 C409 0000 0000 0000 0000 0000 13  2B  19  00  0000 0000 0000 00  00  64  00  00  00  00  00  00  00   00   64   00   00   515D34E900007A2E BC4C         0404010301 00  00000201010000CD30 0F00           75190C1A6FD800000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
>  Header    >Time  >M   >S   >S1  >S2  >S3  >S4  >S5  >S6  >S7  >S8  >S9  >S10 >S11 >S12 >S13 >S14 >S15 >S16 >S18 >S17 >AI1 >AI2 >AI3 >P1 >P2 >P3 >P4 >RF1 >RF2 >RF3 >A1 >A2 >A3 >A4 >A5 >A6 >A7 >A8 >A9 >A10 >A11 >A12 >A13 >A14 >16Chars skip    >Solarertrag >10C skip  >P5 >18Chars skip      >Solarleistung
```
## Conversion Script
The attached script is not required to run the template. Instead it's embedded in the preprocessing of the raw item `solvis.get_status`. 
