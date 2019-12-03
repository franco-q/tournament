module.exports = {
	baseUrl: '',
	assetsDir: undefined,
	runtimeCompiler: undefined,
	productionSourceMap: false,
	parallel: undefined,
	filenameHashing: false,
	css: undefined,
	chainWebpack: config => {
		config.optimization.splitChunks(false);	
	}
};


