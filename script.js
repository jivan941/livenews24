document.addEventListener('DOMContentLoaded', function() {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const fileInfo = document.getElementById('fileInfo');
    const upscaleBtn = document.getElementById('upscaleBtn');
    const resultSection = document.getElementById('resultSection');
    const resultVideo = document.getElementById('resultVideo');
    const resultInfo = document.getElementById('resultInfo');
    const downloadBtn = document.getElementById('downloadBtn');
    const progressSection = document.getElementById('progressSection');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const statusText = document.getElementById('statusText');

    let selectedFile = null;
    let upscaledVideoUrl = null;

    // Handle drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropzone.style.borderColor = '#6366f1';
        dropzone.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
    }

    function unhighlight() {
        dropzone.style.borderColor = '#94a3b8';
        dropzone.style.backgroundColor = '';
    }

    // Handle file drop
    dropzone.addEventListener('drop', handleDrop, false);
    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', function() {
        if (this.files.length) {
            handleFiles(this.files);
        }
    });

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length) {
            handleFiles(files);
        }
    }

    function handleFiles(files) {
        const file = files[0];
        if (!file.type.startsWith('video/')) {
            alert('Please upload a video file.');
            return;
        }

        selectedFile = file;
        displayFileInfo(file);
        upscaleBtn.disabled = false;
    }

    function displayFileInfo(file) {
        fileInfo.style.display = 'block';
        fileInfo.innerHTML = `
            <p><strong>Selected File:</strong> ${file.name}</p>
            <p><strong>Size:</strong> ${formatFileSize(file.size)}</p>
            <p><strong>Type:</strong> ${file.type}</p>
        `;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Upscale button click handler
    upscaleBtn.addEventListener('click', async function() {
        if (!selectedFile) return;

        // Show progress section
        resultSection.classList.add('hidden');
        progressSection.classList.remove('hidden');
        updateProgress(0, 'Uploading video for processing...');

        try {
            // In a real implementation, you would upload to your backend or directly to the API
            // For this demo, we'll simulate the process
            
            // Simulate upload progress
            for (let i = 0; i <= 100; i += 10) {
                await new Promise(resolve => setTimeout(resolve, 300));
                updateProgress(i, i < 50 ? 'Uploading video...' : 'Processing video with AI...');
            }

            // Simulate AI processing
            for (let i = 10; i <= 100; i += 10) {
                await new Promise(resolve => setTimeout(resolve, 500));
                updateProgress(i, 'Enhancing video quality with AI...');
            }

            // In a real app, you would get the processed video URL from the API response
            // For demo purposes, we'll use the original file (in reality, this would be the upscaled version)
            const videoUrl = URL.createObjectURL(selectedFile);
            
            // Hide progress and show result
            progressSection.classList.add('hidden');
            resultSection.classList.remove('hidden');
            
            // Display the "upscaled" video
            resultVideo.src = videoUrl;
            upscaledVideoUrl = videoUrl;
            
            const scaleFactor = document.getElementById('scaleFactor').value;
            const model = document.getElementById('model').value;
            
            resultInfo.textContent = `Video upscaled to ${scaleFactor}x using ${model === 'basic' ? 'Basic Enhancement' : 'Advanced Super-Resolution'} model.`;
            
        } catch (error) {
            console.error('Error during upscaling:', error);
            updateProgress(0, 'Error processing video. Please try again.');
            setTimeout(() => {
                progressSection.classList.add('hidden');
            }, 2000);
        }
    });

    function updateProgress(percent, message) {
        progressBar.style.width = `${percent}%`;
        progressText.textContent = `${percent}%`;
        statusText.textContent = message;
    }

    // Download button click handler
    downloadBtn.addEventListener('click', function() {
        if (!upscaledVideoUrl) return;
        
        const a = document.createElement('a');
        a.href = upscaledVideoUrl;
        a.download = `upscaled_${selectedFile.name}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Note: In a production environment, you would:
    // 1. Upload the video to your backend or directly to the AI API
    // 2. Use a service like Replicate's video upscaling model
    // 3. Poll for the result and then provide the download
    
    // Example for Replicate API (would need backend implementation):
    /*
    async function upscaleWithReplicate(file) {
        const response = await fetch('https://api.replicate.com/v1/predictions', {
            method: 'POST',
            headers: {
                'Authorization': 'Token YOUR_REPLICATE_API_KEY',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                version: "model_version_id",
                input: {
                    video: file,
                    scale: document.getElementById('scaleFactor').value
                }
            })
        });
        
        const result = await response.json();
        return result;
    }
    */
});
