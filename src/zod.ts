// Exercise 1
class DogService {
    private imageUrl = "";

   constructor() {
       this.imageUrl = 'https://dog.ceo/api/breeds/image/random';
   }
   async getRandomDogImage(): Promise<string> {
       const response = await fetch(this.imageUrl);
       const data = await response.json();
       // console.log(data)
       this.imageUrl=data.message
       return this.imageUrl;
   }

   getImageUrl(): string {
       return this.imageUrl;
   }
}
const services = new DogService();
services.getRandomDogImage().then(()=>(console.log(services.getImageUrl())));





// // Exercise2


// class ApiFetcher {
//     private url = "https://api.publicapis.org/entries";
//     constructor(url: string) {
//         this.url = url;
//     }
//     async fetch(): Promise<any> {
//         const response = await fetch(this.url);
//         const data = await response.json();
//         return data;
//     }


// }
// class AuthlessApiFilter extends ApiFetcher {
//     constructor(url: string,) {
//         super(url);
       
//     }

//     async fetch(): Promise<any> {
//         const response = await super.fetch();
//         if (response.auth === "No") {
//             return response;
//         } else {
//             return null;
//         }
//     }

// }
// const noAuthApis= new AuthlessApiFilter('https://api.publicapis.org/entries');
// noAuthApis.fetch()
// console.log(noAuthApis.fetch())


// Exercise3


abstract class FactProvider{
   abstract getFact(): Promise<string>;
}


class CatFactProvider extends FactProvider{
  
   async getFact(): Promise<string> {
       const response = await fetch('https://catfact.ninja/fact');
       const data = await response.json();
       return data.fact;
   }

   
}
class HardcodedFactProvider extends FactProvider{
   async getFact(): Promise<string> {
       return `helllo`;
   }
}
async function print(provider:FactProvider){
   console.log(await provider.getFact());
}

const catFactProvider = new CatFactProvider();
print(catFactProvider);
const hardcodedFactProvider = new HardcodedFactProvider();
print(hardcodedFactProvider)