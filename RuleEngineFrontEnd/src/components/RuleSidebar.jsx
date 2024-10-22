import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RuleSidebar = ({ userEmail }) => {
  const [rules, setRules] = useState([]);
  const [rule, setRule] = useState('');
  const [error, setError] = useState('');

  // Fetch rules when the userEmail changes
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/rule/getAll', {
          params: { email: userEmail }
        });
        setRules(response.data);
      } catch (err) {
        setError('Failed to fetch rules.');
        console.error(err);
      }
    };

    if (userEmail) {
      fetchRules();
    }
  }, [userEmail]);

  const addRule = async () => {
    try {
        await axios.post('http://localhost:8080/api/rule', 
        {
          rule: rule,  // Wrap rule inside an object with a "rule" key
        },
        {
          params: { email: userEmail }, // Include email in query params
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // Update rule list after adding a new rule
        setRules([...rules, { ruleString: rule }]);
        setrule(''); // Reset input field
        setError('');
    } catch (err) {
        setError('Failed to add rule.');
        console.error(err);
    }
};

  const deleteRule = async (ruleId) => {
    try {
      await axios.delete(`http://localhost:8080/api/rule/${ruleId}`, {
        params: { email: userEmail }
      });

      // Update rule list after deleting
      setRules(rules.filter((rule) => rule.id !== ruleId));
      setError('');
    } catch (err) {
      setError('Failed to delete rule.');
      console.error(err);
    }
  };

  return (
    <div className="sidebar">
      <h2>Your Rules</h2>
      {rules.length === 0 ? (
        <p>No rules found.</p>
      ) : (
        <ul>
          {rules.map((rule) => (
            <li key={rule.id}>
              {rule.ruleString}
              <button onClick={() => deleteRule(rule.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <div>
        <h3>Add New Rule</h3>
        <input
          type="text"
          placeholder="Enter new rule"
          value={rule}
          onChange={(e) => setRule(e.target.value)}
        />
        <button onClick={addRule}>Add Rule</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      
    </div>
  );
};

export default RuleSidebar;
