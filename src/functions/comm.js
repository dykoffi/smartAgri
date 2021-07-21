export function ask(text, data) {
    if (/informations sur la culture/.test(text)) {
        return `
        Les informations sur la culture sont.
        Stade. 32 eme jour.
        Type de culture. tomate.
        Variété. tomate cérise.
        Etat de santé. bon.
        Type de plan. croissance determinée.
       `
    } else if (/(quelles sont les)? ?(conditions) (météorologiques|météo)/.test(text)) {
        return `
        Les conditions météorologiques sont.
        Température . 27 dégré celsius.
        Humidité du sol. 52%.
        Humidité de l'air. 63%.
        Luminosité. 152 lux.
       `
    }else {
        return null
    }
}