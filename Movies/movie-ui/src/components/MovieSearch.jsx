import { useState, useEffect} from 'react';
import axios from 'axios';

function MovieSearch({ searchQuery, onSelect}) {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
}