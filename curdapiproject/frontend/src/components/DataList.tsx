import React, { useState, useEffect } from 'react';
import api from '../api';
import axios from 'axios';

interface IData {
    _id: string;
    title: string;
    description: string;
}

const DataList = () => {
    const [dataList, setDataList] = useState<IData[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [editId, setEditId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    axios.defaults.withCredentials = true;

    const fetchData = async () => {
        try {
            const response = await api.get('/data');
            setDataList(response.data);
        } catch (error) {
            if (error instanceof Error) {
                alert('Error fetching data: ' + error.message);
            } else {
                alert('Unknown error fetching data');
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/data/${editId}`, { title, description });
                alert('Data updated successfully');
            } else {
                await api.post('/data', { title, description });
                alert('Data created successfully');
            }
            setTitle('');
            setDescription('');
            setEditId(null);
            fetchData();
        } catch (error) {
            if (error instanceof Error) {
                alert('Error: ' + error.message);
            } else {
                alert('Unknown error');
            }
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/data/${id}`);
            alert('Data deleted successfully');
            fetchData();
        } catch (error) {
            if (error instanceof Error) {
                alert('Error: ' + error.message);
            } else {
                alert('Unknown error');
            }
        }
    };

    const handleEdit = (data: IData) => {
        setEditId(data._id);
        setTitle(data.title);
        setDescription(data.description);
    };

    // Search and filter data 
    const filteredData = dataList.filter(data => 
        data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="flex flex-col md:flex-row items-start justify-between p-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg">
      
        <div className="w-full md:w-1/2 p-4 bg-white rounded-lg shadow-lg transform transition-transform hover:scale-105 duration-300">
            <h2 className="text-3xl font-bold text-green-600 mb-4">{editId ? 'Edit Data' : 'Create Data'}</h2>
            
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mb-4 w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mb-4 w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 rows=4"
                />
                <button
                    type="submit"
                    className="w-full py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition duration-200"
                >
                    {editId ? 'Update' : 'Create'}
                </button>
            </form>
        </div>
    
        <div className="w-full md:w-2/3 p-4 mt-6 md:mt-0 bg-white rounded-lg shadow-lg transform transition-transform hover:scale-105 duration-300 mx-5">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">Data List</h2>
            
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4 w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            
            <ul className="max-h-60 overflow-y-auto">
                {currentItems.map((data) => (
                    <li key={data._id} className="mb-4 border-b border-gray-300 pb-2">
                        <h3 className="text-lg font-bold text-green-700">{data.title}</h3>
                        <p className="text-gray-700">{data.description}</p>
                        <div className="mt-2 flex space-x-2">
                            <button
                                onClick={() => handleEdit(data)}
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(data._id)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
    
           
            <div className="mt-4 flex items-center space-x-4">
                <button 
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
                    disabled={currentPage === 1}
                    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 ${currentPage === 1 && 'opacity-50 cursor-not-allowed'}`}
                >
                    Previous
                </button>
                <span className="text-gray-700">Page {currentPage} of {totalPages}</span>
                <button 
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200 ${currentPage === totalPages && 'opacity-50 cursor-not-allowed'}`}
                >
                    Next
                </button>
            </div>
        </div>
    </div>
    
    
    );
};

export default DataList;
