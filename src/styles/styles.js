import { StyleSheet } from 'react-native';



const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  homeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  homeText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  homeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  homePrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cardFooterText: {
    fontSize: 14,
  },
  cardFooterTextRight: {
    fontSize: 14,
    textAlign: 'right',
  },
  cardContent: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContentText: {
    fontSize: 14,
  },
  pickerContainer: {
    flex: 1,
    marginRight: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  picker: {
    height: 40,
  },
  venderButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  venderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // IngredientListScreen styles
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  table: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 10,
  },
  header: {
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // TortasScreen styles
  tortasContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  tortasTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  tortasList: {
    flex: 1,
    marginBottom: 20,
  },
  tortasItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  tortasItemText: {
    fontSize: 16,
  },

  // NewIngredientScreen styles
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#007bff',
    flex: 1,
    marginRight: 10,
    borderRadius: 5,
    paddingVertical: 10,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    flex: 1,
    marginLeft: 10,
    borderRadius: 5,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },


  // Responsive styles
  responsiveContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  responsiveFormContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  newStyle: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Navigation styles
  containerNav: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    backgroundColor: '#333',
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 1,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  hiddenText: {
    opacity: 0,
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 20,
    width: '80%',
  },
  hiddenSeparator: {
    opacity: 0,
  },
  bottomMenu: {
    paddingBottom: 20,
  },
  bottomMenuItem: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  expandButton: {
    width: 36,
    height: 36,
    backgroundColor: '#fff',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  expandIcon: {
    fontSize: 20,
  },
});

export default styles;










