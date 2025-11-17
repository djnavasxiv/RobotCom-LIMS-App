import React, { useState, useEffect } from 'react';
import { Test } from '../../../../domain/entities/Test';
import { TestService } from '../../../../application/services/TestService';
import './TestSelectionGrid.css';

interface TestSelectionGridProps {
  selectedTests: Array<{ testId: string; testName: string; price: number }>;
  onAddTest: (test: Test) => void;
  onRemoveTest: (testId: string) => void;
}

export const TestSelectionGrid: React.FC<TestSelectionGridProps> = ({
  selectedTests,
  onAddTest,
  onRemoveTest,
}) => {
  const [allTests, setAllTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTests, setFilteredTests] = useState<Test[]>([]);

  const testService = new TestService();

  // Load all tests on component mount
  useEffect(() => {
    const loadTests = async () => {
      setIsLoading(true);
      try {
        const data = await testService.getAllTests();
        setAllTests(data);
        setFilteredTests(data);
      } catch (error) {
        console.error('Error loading tests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTests();
  }, []);

  // Filter tests based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTests(allTests);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = allTests.filter(
        (test) =>
          test.name.toLowerCase().includes(query) ||
          test.code.toLowerCase().includes(query)
      );
      setFilteredTests(filtered);
    }
  }, [searchQuery, allTests]);

  const isTestSelected = (testId: string) => {
    return selectedTests.some((t) => t.testId === testId);
  };

  return (
    <div className="test-selection-grid">
      <div className="grid-header">
        <h3>EXAMENES / PERFILES (Tests / Profiles)</h3>
        <input
          type="text"
          placeholder="Search tests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {isLoading ? (
        <div className="loading">Loading tests...</div>
      ) : (
        <>
          {/* Available Tests */}
          <div className="available-tests">
            <h4>Available Tests</h4>
            <table className="tests-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>Select</th>
                  <th>EXAMEN (Test Name)</th>
                  <th style={{ width: '100px' }}>CÓDIGO</th>
                  <th style={{ width: '100px' }}>PRECIO $</th>
                </tr>
              </thead>
              <tbody>
                {filteredTests.map((test) => (
                  <tr
                    key={test.id}
                    className={isTestSelected(test.id) ? 'selected' : ''}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={isTestSelected(test.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onAddTest(test);
                          } else {
                            onRemoveTest(test.id);
                          }
                        }}
                      />
                    </td>
                    <td>{test.name}</td>
                    <td>{test.code}</td>
                    <td className="price">${test.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Selected Tests Summary */}
          {selectedTests.length > 0 && (
            <div className="selected-tests">
              <h4>Selected Tests ({selectedTests.length})</h4>
              <table className="selected-tests-table">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>EXAMEN (Test Name)</th>
                    <th style={{ width: '100px' }}>PRECIO $</th>
                    <th style={{ width: '50px' }}>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTests.map((test, index) => (
                    <tr key={test.testId}>
                      <td>{index + 1}</td>
                      <td>{test.testName}</td>
                      <td className="price">${test.price.toFixed(2)}</td>
                      <td>
                        <button
                          className="remove-btn"
                          onClick={() => onRemoveTest(test.testId)}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};
