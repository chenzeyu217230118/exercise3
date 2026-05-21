const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const form = ref({
      fullName: '',
      dob: '',
      gender: '',
      totalVisitors: null,
      totalChildren: null,
      accommodation: '',
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    });

    const errors = ref({
      fullName: '',
      dob: '',
      gender: '',
      selectedPlaces: '',
      totalVisitors: '',
      totalChildren: '',
      accommodation: '',
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    });
    
    const generalError = ref('');
    const places = ref([]);
    const isLoadingPlaces = ref(false);
    const selectedPlaces = ref([]);
    const accommodationOptions = ref([
      { value: 'none', label: 'No accommodation needed' },
      { value: 'forest_view', label: 'Forest View Hotel' },
      { value: 'totoro_inn', label: 'Totoro Family Inn' },
      { value: 'witch_valley', label: 'Witch Valley Guesthouse' },
      { value: 'luxury_ghibli', label: 'Luxury Ghibli Resort' }
    ]);
    const showSummary = ref(false);
    
    const ghibliParkData = [
      { "id": "gwh1", "name": "Central Stairs", "image": "assets/gwh1.jpeg", "description": "A brilliant mosaic tile staircase connecting first and second floors." },
      { "id": "gwh2", "name": "Open Warehouse", "image": "assets/gwh2.jpeg", "description": "Contains production artifacts and sculptures from past exhibits in Japan and abroad" },
      { "id": "gwh3", "name": "No-Face", "image": "assets/gwh3.jpeg", "description": "Part of interactive exhibits, where you can become your favorite Studio Ghibli characters." },
      { "id": "gwh4", "name": "Ghibli Meals", "image": "assets/gwh4.jpeg", "description": "Why does the food in Studio Ghibli films look so delicious!? Those secrets are revealed here." },
      { "id": "gwh5", "name": "Ghibli Posters", "image": "assets/gwh5.jpeg", "description": "A collection of Studio Ghibli posters, film and music packagings, books and more, all in one place" },
      { "id": "gwh6", "name": "Screening Room Cinema Orion", "image": "assets/gwh6.jpeg", "description": "Seating about 170 people, Orion screens Studio Ghibli animated-shorts." },
      { "id": "gwh7", "name": "Director's Office", "image": "assets/gwh7.jpeg", "description": "Yubaba from 'Spirited Away' is busy at work." },
      { "id": "gwh8", "name": "Catbus Room", "image": "assets/gwh8.jpeg", "description": "In the play area that recreates the world of My Neighbor Totoro, a one-of-a-kind Cat Bus awaits." },
      { "id": "gwh9", "name": "Children's Town", "image": "assets/gwh9.jpeg", "description": "This area is a mini-replica of the Higashi-Koganei Station area in Tokyo where Studio Ghibli is located." },
      { "id": "gwh10", "name": "Garden in the Sky", "image": "assets/gwh10.jpeg", "description": "Robot Soldiers, from Castle in the Sky, wait patiently for their master to return." },
      { "id": "gwh11", "name": "The House Below and the Little People's Garden", "image": "assets/gwh11.jpeg", "description": "The house where the main character Arrietty and her family live and the surrounding garden." },
      { "id": "gwh12", "name": "Shop 'Adventurous Flying Squadron'", "image": "assets/gwh12.jpeg", "description": "Sells items from all Studio Ghibli productions as well as original Ghibli Park items." },
      { "id": "gwh13", "name": "Transcontinental Flight Cafe", "image": "assets/gwh13.jpeg", "description": "The cafe has a line-up of sandwiches, pizzas, etc." },
      { "id": "hoy1", "name": "Elevator Tower", "image": "assets/hoy1.jpeg", "description": "A late 19th century sci-fi architecture that appears in 'Castle in the Sky' and 'Howl's Moving Castle'." },
      { "id": "hoy2", "name": "World Emporium", "image": "assets/hoy2.jpeg", "description": "Antique repair and resale shop from 'Whisper of the Heart'." },
      { "id": "hoy3", "name": "The Cat Bureau", "image": "assets/hoy3.jpeg", "description": "From 'The Cat Returns', this is a cat-sized single-storey wooden building." },
      { "id": "hoy4", "name": "The Rotary", "image": "assets/hoy4.jpeg", "description": "A roundabout like the one in the town square from 'Whisper of the Heart'." },
      { "id": "df1", "name": "Satsuki and Mei's House", "image": "assets/df1.jpeg", "description": "This is the Japanese-Western style house Satsuki and Mei moved to in 'My Neighbor Totoro'." },
      { "id": "df2", "name": "Dondoko-do", "image": "assets/df2.jpeg", "description": "A 5-meter-tall wooden play equipment where children of twelve years and under can play inside." },
      { "id": "df3", "name": "Dondoko Shop", "image": "assets/df3.jpeg", "description": "Keychains, amulet pouches and original Dondoko Forest souvenirs are available for purchase in this shop." },
      { "id": "df4", "name": "Dondoko-Dokoro", "image": "assets/df4.jpeg", "description": "Sells drinks, souvenirs and seasonal items." },
      { "id": "df5", "name": "Dondoko-go", "image": "assets/df5.jpeg", "description": "The slope car connects the ground level to the peak of the Dondoko Forest hill." },
      { "id": "mv1", "name": "Tatara-ba", "image": "assets/mv1.jpeg", "description": "This is a hands-on learning center designed to look like a building in 'Princess Mononoke'." },
      { "id": "mv2", "name": "Charcoal-grilled Gohei-Mochi Cooking Experience", "image": "assets/mv2.jpeg", "description": "Add your preferred sauce and cook this beloved local snack yourself over a traditional charcoal grill." },
      { "id": "mv3", "name": "Stone-milled Kinako Grinding Experience", "image": "assets/mv3.jpeg", "description": "Learn the traditional way of making kinako (soybean flour) using a stone mill." },
      { "id": "mv4", "name": "Lord Okkoto", "image": "assets/mv4.jpeg", "description": "This is a slide based on the character Lord Okkoto from 'Princess Mononoke'." },
      { "id": "mv5", "name": "Demon Spirit", "image": "assets/mv5.jpeg", "description": "This structure is based on the Demon Spirit from 'Princess Mononoke'." },
      { "id": "mv6", "name": "Mononoke Village Rest Stop", "image": "assets/mv6.jpeg", "description": "The rest stop shop sells original items as well as refreshments to help you relax and recharge." },
      { "id": "vow1", "name": "The Mouth of the Witch", "image": "assets/vow1.jpeg", "description": "At the entrance of Valley of Witches, this structure is inspired by the witch Bella Yaga from Earwig and the Witch." },
      { "id": "vow2", "name": "Okino Residence", "image": "assets/vow2.jpeg", "description": "This is a two-storey house where Kiki, the main character from 'Kiki's Delivery Service', lives." },
      { "id": "vow3", "name": "Guchokipanya Bakery", "image": "assets/vow3.jpeg", "description": "The bakery where the main character Kiki and her black cat Jiji from 'Kiki's Delivery Service' live." },
      { "id": "vow4", "name": "Howl's Castle", "image": "assets/vow4.jpeg", "description": "About 20-meters-tall, this is the castle with creature-like features from 'Howl's Moving Castle'." },
      { "id": "vow5", "name": "Hatter's Millinery", "image": "assets/vow5.jpeg", "description": "This is the two-storey hat shop that Sophie, the main character from 'Howl's Moving Castle', manages." },
      { "id": "vow6", "name": "The House of Witches", "image": "assets/vow6.jpeg", "description": "This house is where Earwig, the main character from 'Earwig and the Witch', was taken to live." },
      { "id": "vow7", "name": "Carousel", "image": "assets/vow7.jpeg", "description": "This is a ride for children imagined as one from a traveling fair that comes to the village once a year." },
      { "id": "vow8", "name": "Flying Machine", "image": "assets/vow8.jpeg", "description": "This is a ride for children imagined as one from a traveling fair that comes to the village once a year." },
      { "id": "vow9", "name": "Lift for Witches", "image": "assets/vow9.jpeg", "description": "This elevator goes up to the second floor of Guchokipanya Bakery and Hatter's Millinery." },
      { "id": "vow10", "name": "Flying Oven", "image": "assets/vow10.jpeg", "description": "A restaurant with an impressive brick exterior is located near the entrance to the Valley of Witches." },
      { "id": "vow11", "name": "Witch Coven 13", "image": "assets/vow11.jpeg", "description": "This shop has a variety of original Valley of Witches items." }
    ];
    
    const isPlaceSelected = (id) => {
      return selectedPlaces.value.some(p => p.id === id);
    };
    
    const togglePlace = (place) => {
      const exists = selectedPlaces.value.some(p => p.id === place.id);
      if (exists) {
        selectedPlaces.value = selectedPlaces.value.filter(p => p.id !== place.id);
      } else {
        selectedPlaces.value.push(place);
      }
      if (errors.value.selectedPlaces) errors.value.selectedPlaces = '';
    };
    
    const truncateDescription = (desc) => {
      if (!desc) return '';
      if (desc.length > 100) {
        return desc.substring(0, 97) + '...';
      }
      return desc;
    };
    
    const handleImageError = (event) => {
      event.target.src = 'https://placehold.co/400x200?text=Image+Not+Found';
    };
    
    const loadPlaces = () => {
      places.value = ghibliParkData;
      isLoadingPlaces.value = false;
    };
    
    const getAccommodationLabel = (val) => {
      const found = accommodationOptions.value.find(opt => opt.value === val);
      return found ? found.label : 'Not selected';
    };
    
    const clearErrors = () => {
      Object.keys(errors.value).forEach(key => {
        errors.value[key] = '';
      });
      generalError.value = '';
    };
    
    const validateForm = () => {
      let isValid = true;
      
      if (!form.value.fullName.trim()) {
        errors.value.fullName = 'Full name is required.';
        isValid = false;
      } else {
        errors.value.fullName = '';
      }
      
      if (!form.value.dob) {
        errors.value.dob = 'Date of birth is required.';
        isValid = false;
      } else {
        const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
        if (!dateRegex.test(form.value.dob)) {
          errors.value.dob = 'Please enter date in MM/DD/YYYY format.';
          isValid = false;
        } else {
          errors.value.dob = '';
        }
      }
      
      if (!form.value.gender) {
        errors.value.gender = 'Please select a gender.';
        isValid = false;
      } else {
        errors.value.gender = '';
      }
      
      if (!selectedPlaces.value.length) {
        errors.value.selectedPlaces = 'Please select at least one Ghibli Park attraction.';
        isValid = false;
      } else {
        errors.value.selectedPlaces = '';
      }
      
      if (form.value.totalVisitors === null || form.value.totalVisitors === '' || form.value.totalVisitors < 1) {
        errors.value.totalVisitors = 'Total number of visitors must be at least 1.';
        isValid = false;
      } else {
        errors.value.totalVisitors = '';
      }
      
      if (form.value.totalChildren === null || form.value.totalChildren === '' || form.value.totalChildren < 0) {
        errors.value.totalChildren = 'Number of children must be 0 or more.';
        isValid = false;
      } else {
        errors.value.totalChildren = '';
      }
      
      if (form.value.totalChildren !== null && form.value.totalVisitors !== null && form.value.totalChildren > form.value.totalVisitors) {
        errors.value.totalChildren = 'Children count cannot exceed total visitors.';
        isValid = false;
      } else if (errors.value.totalChildren === '') {
        errors.value.totalChildren = '';
      }
      
      if (!form.value.accommodation) {
        errors.value.accommodation = 'Please select an accommodation option.';
        isValid = false;
      } else {
        errors.value.accommodation = '';
      }
      
      if (!form.value.cardholderName.trim()) {
        errors.value.cardholderName = 'Cardholder name is required.';
        isValid = false;
      } else {
        errors.value.cardholderName = '';
      }
      
      if (!form.value.cardNumber.trim()) {
        errors.value.cardNumber = 'Card number is required.';
        isValid = false;
      } else if (!/^\d[\d\s]{13,18}$/.test(form.value.cardNumber.replace(/\s/g, '')) && form.value.cardNumber.replace(/\s/g, '').length < 13) {
        errors.value.cardNumber = 'Enter a valid card number (13-16 digits).';
        isValid = false;
      } else {
        errors.value.cardNumber = '';
      }
      
      if (!form.value.expiryDate) {
        errors.value.expiryDate = 'Expiration date is required.';
        isValid = false;
      } else {
        const expiryRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
        if (!expiryRegex.test(form.value.expiryDate)) {
          errors.value.expiryDate = 'Please enter date in MM/YYYY format.';
          isValid = false;
        } else {
          const [month, year] = form.value.expiryDate.split('/');
          const expDate = new Date(parseInt(year), parseInt(month), 1);
          const today = new Date();
          today.setDate(1);
          if (expDate < today) {
            errors.value.expiryDate = 'Expiration date must be in the future.';
            isValid = false;
          } else {
            errors.value.expiryDate = '';
          }
        }
      }
      
      if (!form.value.cvv) {
        errors.value.cvv = 'CVV is required.';
        isValid = false;
      } else if (!/^\d{3,4}$/.test(form.value.cvv)) {
        errors.value.cvv = 'CVV must be 3 or 4 digits.';
        isValid = false;
      } else {
        errors.value.cvv = '';
      }
      
      return isValid;
    };
    
    const generateItinerary = () => {
      clearErrors();
      const valid = validateForm();
      if (valid) {
        generalError.value = '';
        showSummary.value = true;
      } else {
        showSummary.value = false;
        generalError.value = 'There are mandatory items pending to be filled. Please complete the required fields.';
      }
    };
    
    onMounted(() => {
      loadPlaces();
    });
    
    return {
      form,
      errors,
      generalError,
      places,
      isLoadingPlaces,
      selectedPlaces,
      accommodationOptions,
      showSummary,
      isPlaceSelected,
      togglePlace,
      truncateDescription,
      handleImageError,
      loadPlaces,
      getAccommodationLabel,
      clearErrors,
      validateForm,
      generateItinerary
    };
  }
}).mount('#app');