/**
 * Mapa: model z instrukcji → slug karty produktu na takma.com.pl.
 *
 * Powód: baner lejka pod instrukcją linkował do STRONY KATEGORII, więc moc linku
 * i intencja zakupowa rozjeżdżały się po całej kategorii zamiast wzmacniać kartę,
 * która ma rankować na nazwę modelu. Przykład z 20.08.2026: instrukcja ZD421t
 * (9. pozycja w Google na „zebra zd421t") linkowała do /drukarki-etykiet-zebra,
 * podczas gdy karta /produkt/zebra-zd421t walczyła o TOP10 z pozycji ~10,5.
 *
 * Mapa powstała z zestawienia kluczy `polishManuals` z listą slugów w katalogu
 * takmy — każdy wpis wskazuje istniejącą kartę produktu. Modele bez wpisu
 * (wycofane, nieprowadzone) dalej korzystają z linku kategoriowego w FunnelBanners.
 *
 * Aktualizacja po dodaniu nowych kart w takma.com.pl: porównaj klucze
 * polishManuals ze slugami z src/data/products.ts i dopisz brakujące.
 */
// ZC350 celowo pominięty: /produkt/zebra-zc350 przekierowuje (308) na kategorię
// drukarek kart, więc link bezpośredni tylko dokładałby przeskok.
export const TAKMA_PRODUCT_BY_MODEL: Record<string, string> = {
  DS2208: 'zebra-ds2208',
  DS2278: 'zebra-ds2278',
  DS3608: 'zebra-ds3608-sr',
  DS3678: 'zebra-ds3678-sr',
  DS4608: 'zebra-ds4608',
  DS4678: 'zebra-ds4678',
  DS8208: 'zebra-ds8208',
  DS8288: 'zebra-ds8288',
  DS9308: 'zebra-ds9308',
  DS9908: 'zebra-ds9908',
  ET401: 'zebra-et401',
  LI2208: 'zebra-li2208',
  TC22: 'zebra-tc22',
  TC27: 'zebra-tc27',
  TC501: 'zebra-tc501',
  TC53: 'zebra-tc53',
  TC58: 'zebra-tc58',
  TC701: 'zebra-tc701',
  ZC100: 'zebra-zc100',
  ZC300: 'zebra-zc300',
  ZD220D: 'zebra-zd220d',
  ZD220T: 'zebra-zd220t',
  ZD230D: 'zebra-zd230d',
  ZD230T: 'zebra-zd230t',
  ZD411D: 'zebra-zd411d',
  ZD411T: 'zebra-zd411t',
  ZD421D: 'zebra-zd421d',
  ZD421T: 'zebra-zd421t',
  ZD510: 'zebra-zd510-hc',
  ZD621D: 'zebra-zd621d',
  ZD621T: 'zebra-zd621t',
  ZQ210: 'zebra-zq210',
  ZQ511: 'zebra-zq511',
  ZQ521: 'zebra-zq521',
  ZT111: 'zebra-zt111',
  ZT231: 'zebra-zt231',
  ZT411: 'zebra-zt411',
  ZT421: 'zebra-zt421',
  ZT510: 'zebra-zt510',
  ZT610: 'zebra-zt610',
  ZT620: 'zebra-zt620',
}
