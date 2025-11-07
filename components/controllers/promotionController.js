const Promotion = require('../config/promotionSchema')
const admin = require('firebase-admin')

async function addPromotion(promotionData){

const {title,body,start_date,end_date} = promotionData
return new Promise( async(resolve,reject)=>{
    if(!title){
        console.error(`[promotionControllerError] data missing`);
        reject(`Parametros incorrectos`);
        return false
    }
const newPromotion = new Promotion({title,body,start_date,end_date})
    await newPromotion.save()
    
     const message = {
      // Data payload (datos que el cliente Flutter puede usar)
      data: {
        promotionId: newPromotion._id.toString(),
        title: title,
        body: body,
        // Puedes mandar más datos relevantes
      },
      // Notification payload (lo que ve el usuario)
      notification: {
        title: `🎉 Nueva Promoción: ${title}`,
        body: body,
      },
      // Topic o Token(s) para la entrega.
      // Aquí usaremos un "topic" para notificar a *todos* los usuarios suscritos.
      topic: 'new_promotions', // Los clientes Flutter deben suscribirse a este topic
    };

    const response = await admin.messaging().send(message);

    console.log('Notificación FCM enviada con éxito:', response);

    resolve({ message: 'Promoción creada y notificada', promotion: newPromotion });
})
}

/*async function getLastPromotion(){
    return new Promise((resolve,reject)=>{
        const listMovies = db.countMovies()
        if(listMovies < 1){
            console.error(`[movieControllerError] data missing movies`);
            reject(`no hay peliculas`);
            return false;
        }
        console.log("peticion de Get aceptada");
        const ArrayMovies = db.listarMovies()
        resolve(ArrayMovies)
    })
}*/

module.exports = {
    addPromotion,
    
}