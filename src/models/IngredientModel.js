class IngredientModel {
    constructor(data) {
      this.id = data.id;
      this.nombre = data.nombre;
      this.unidadMedida = data.unidad_Medida;
      this.tamanoPaquete = data.tamano_Paquete;
      this.costo = data.costo;
      this.stock = data.CantidadStock;
    }
  }
  
  export default IngredientModel;
  
  
  