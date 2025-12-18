"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function BulkUpdatePage() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  // Handle file selection
  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
    setLogs([]);
    setProgress(0);
  };

  // Main update function
  const handleUpdate = async () => {
    if (!file) {
      alert("Please select an Excel file first.");
      return;
    }

    setLoading(true);
    setProgress(0);
    setLogs([]);

    // Read Excel file
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    setTotal(rows.length);

    const logEntries = [];

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      // Extract data from Excel columns
      const assetId = row.id;
      const title = row["Title"];
      const filename = row["Filename"];
      const modelName = row["Model Name"];
      const modelCode = row["Model Code"];
      const altText = row["AltText"];
      const brand = row["Brand"];
      const description = row["Description"];
      const assetType = row["Asset Type"];

      // Skip rows without assetId
      if (!assetId) {
        logEntries.push({
          row: i + 1,
          assetId: "N/A",
          status: "⚠️ SKIPPED",
          reason: "Missing Asset ID",
        });
        setProgress((prev) => prev + 1);
        continue;
      }

      // Make API call
      try {
        const response = await fetch("/api/update-assets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assetId,
            title,
            filename,
            modelName,
            modelCode,
            altText,
            brand,
            description,
            assetType,
          }),
        });

        const result = await response.json();

        // Log result
        if (result.success) {
          logEntries.push({
            row: i + 1,
            assetId,
            status: "✅ SUCCESS",
            updatedFields: result.updatedFields || 0,
          });
        } else {
          logEntries.push({
            row: i + 1,
            assetId,
            status: "❌ FAILED",
            reason: JSON.stringify(result.error),
          });
        }
      } catch (error) {
        logEntries.push({
          row: i + 1,
          assetId,
          status: "❌ ERROR",
          reason: error.message,
        });
      }

      setProgress((prev) => prev + 1);
    }

    setLogs(logEntries);
    setLoading(false);
    alert("✅ Bulk update process completed!");
    downloadLogs(logEntries);
  };

  // Download logs as Excel
  const downloadLogs = (logData) => {
    const worksheet = XLSX.utils.json_to_sheet(logData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Update Logs");
    XLSX.writeFile(workbook, `update_logs_${Date.now()}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-6 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            📂 MediaValet Attribute Bulk Update Tool
          </h1>
          <p className="text-slate-300">
            Update multiple asset attributes at once using an Excel file
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">
            Step 1: Upload Excel File
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700
                file:cursor-pointer cursor-pointer"
            />
          </div>
          {file && (
            <p className="text-green-400 mt-3 text-sm">
              ✅ File selected: {file.name}
            </p>
          )}
        </div>

        {/* Supported Fields Info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">
            Supported Fields (Excel Column Names)
          </h2>
          <div className=" text-sm">
          <table className="w-full border-collapse">
  <thead>
    <tr className="bg-black/30">
      <th className="p-2 text-left text-blue-400 font-mono">id <span className="text-red-400">(Required)</span></th>
      <th className="p-2 text-left text-blue-400 font-mono">Title</th>
      <th className="p-2 text-left text-blue-400 font-mono">Filename</th>
      <th className="p-2 text-left text-blue-400 font-mono">Model Name</th>
      <th className="p-2 text-left text-blue-400 font-mono">Model Code</th>
      <th className="p-2 text-left text-blue-400 font-mono">AltText</th>
      <th className="p-2 text-left text-blue-400 font-mono">Brand</th>
      <th className="p-2 text-left text-blue-400 font-mono">Description</th>
      <th className="p-2 text-left text-blue-400 font-mono">Asset Type</th>
    </tr>
  </thead>
  <tbody>
    <tr className="bg-black/20">
      <td className="p-2 text-gray-300">Required</td>
      <td className="p-2 text-gray-300">Optional</td>
      <td className="p-2 text-gray-300">Optional</td>
      <td className="p-2 text-gray-300">Optional</td>
      <td className="p-2 text-gray-300">Optional</td>
      <td className="p-2 text-gray-300">Optional</td>
      <td className="p-2 text-gray-300">Optional</td>
      <td className="p-2 text-gray-300">Optional</td>
      <td className="p-2 text-gray-300">Optional</td>
    </tr>
  </tbody>
</table>

          </div>
          <p className="text-slate-400 text-sm mt-4">
            💡 Tip: Only fill in the columns you want to update. Leave others empty.
          </p>
        </div>

        {/* Action Button */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">
            Step 2: Start Processing
          </h2>
          <button
            onClick={handleUpdate}
            disabled={loading || !file}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all
              ${
                loading || !file
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
              } text-white`}
          >
            {loading ? "🔄 Processing..." : "🚀 Start Bulk Update"}
          </button>
        </div>

        {/* Progress Bar */}
        {loading && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 mb-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">Progress</h2>
            <div className="bg-black/30 rounded-full h-6 overflow-hidden border border-white/10">
              <div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-300 flex items-center justify-center text-white text-sm font-semibold"
                style={{ width: `${(progress / total) * 100}%` }}
              >
                {Math.round((progress / total) * 100)}%
              </div>
            </div>
            <p className="text-slate-300 mt-3 text-center">
              {progress} / {total} assets processed
            </p>
          </div>
        )}

        {/* Logs Display */}
        {logs.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">
              Processing Results
            </h2>
            <div className="max-h-96 overflow-y-auto space-y-2">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="bg-black/20 p-3 rounded-lg text-sm font-mono"
                >
                  <span className="text-slate-400">Row {log.row}:</span>{" "}
                  <span className="text-blue-300">{log.assetId}</span> →{" "}
                  <span
                    className={
                      log.status.includes("SUCCESS")
                        ? "text-green-400"
                        : log.status.includes("SKIPPED")
                        ? "text-yellow-400"
                        : "text-red-400"
                    }
                  >
                    {log.status}
                  </span>
                  {log.updatedFields && (
                    <span className="text-slate-400">
                      {" "}
                      ({log.updatedFields} fields)
                    </span>
                  )}
                  {log.reason && (
                    <span className="text-slate-400"> - {log.reason}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}