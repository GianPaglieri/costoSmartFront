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
    marginBottom: 30,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 50,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.50,
    shadowRadius: 4.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: 'roboto',
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'roboto',
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
    width: '100%', 
    flex: 1,
    marginRight: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    
    paddingHorizontal: 10,
  },
  picker: {
    width: '70%', 
    height: 40,
  },
  venderButton: {
    backgroundColor: '#007bff',
    marginTop: 5,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  venderButtonText: {
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

 
  containerNav: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
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
    fontFamily: 'your-chosen-font', // Cambia esto a la fuente que elijas
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










