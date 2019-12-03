<template>
	<div class="container mt-3">
		<div class="btn-list my-3">
			<button class="btn btn-primary" @click="addPool">AGREGAR GRUPO</button>
			<button class="btn btn-primary" @click="reset">RESETEAR</button>
		</div>
		<div class="card" v-if="playoffs.length && playoffs.every(r => r.every(m => m.teams.every(x => x)))">
			<div class="d-flex">
				<ul class="round" v-for="round in playoffs">
					<template v-for="match in round">
						<li class=" spacer">&nbsp;</li>
						<li class="game py-1 game-top" :class="{winner: match.score.home>match.score.away}">
							<span :class="'tag tag_' + match.teams[0].color">{{match.teams[0].name}}<span class="tag-addon">{{match.teams[0].pool}}</span></span>
							<span class="score">{{match.score.home}}</span>
						</li>
						<li class="game py-1 game-spacer">&nbsp;</li>
						<li class="game py-1 game-bottom" :class="{winner: match.score.away>match.score.home}">
							<span :class="'tag tag_' + match.teams[1].color">{{match.teams[1].name}}<span class="tag-addon">{{match.teams[1].pool}}</span></span>
							<span class="score">{{match.score.away}}</span>
						</li>
					</template>
					<li class="spacer">&nbsp;</li>
				</ul>
				<ul class="round">
					<template v-for="m in playoffs[playoffs.length - 1]">
						<li class="spacer">&nbsp;</li>
						<li class="game game-top winner justify-content-center" v-if="m.teams.every(x => x)">
							<div class="p-1">
								<span class="tag mr-1" :class="'tag_' + m.teams[m.score.home>m.score.away ? 0 : 1].color">{{m.teams[m.score.home>m.score.away ? 0 : 1].name}} <span class="tag-addon">{{m.teams[m.score.home>m.score.away ? 0 : 1].pool}}</span></span>
								<i class="fa fa-trophy text-warning"></i>
							</div>
						</li>
						<li class="spacer">&nbsp;</li>
					</template>
				</ul>
			</div>
			<div class="table-responsive">
				<table class="table table-hover table-outline table-vcenter text-nowrap card-table">
					<tbody>
						<template v-for="round in playoffs">
							<tr v-for="match in round"> 
								<td>{{match.nro}}</td>
								<td class="p-1 text-right">
									<i class="fa fa-flag" v-if="match.score.home > match.score.away"></i>
									<span class="tag ml-1" :class="'tag_'+match.teams[0].color">{{match.teams[0].name}}<span class="tag-addon">{{match.teams[0].pool}}</span></span>
								</td>
								<td class="p-1 w-8">
									<input type="text" class="text-center form-control form-control-sm" v-model="match.score.home" @input="" @focus="e => e.target.select()">
								</td>
								<td class="p-1 w-8">
									<input type="text" class="text-center form-control form-control-sm" v-model="match.score.away" @input="" @focus="e => e.target.select()">
								</td>
								<td class="p-1">
									<span class="tag mr-1" :class="'tag_'+match.teams[1].color">{{match.teams[1].name}}<span class="tag-addon">{{match.teams[1].pool}}</span></span>
									<i class="fa fa-flag" v-if="match.score.away > match.score.home"></i>
								</td>
							</tr>
						</template>
					</tbody>
				</table>
			</div>
		</div>
		<div class="card mt-3" v-for="item in matches">
			<div class="card-header">
				<h3 class="card-title">GRUPO {{item.pool}}</h3>
				<div class="card-options">
					<button class="btn btn-primary btn-sm" @click="addTeam(item.pool)">AGREGAR EQUIPO</button>
				</div>
			</div>
			<div class="table-responsive">
				<table class="table table-hover table-outline table-vcenter text-nowrap card-table">
					<tbody>
						<tr v-for="match in item.matches"> 
							<td class="p-1 text-right">
								<i class="fa fa-flag" v-if="match.score.home > match.score.away"></i><span class="tag ml-1" :class="'tag_'+match.teams.home.color">{{match.teams.home.name}}</span></td>
							<td class="p-1 w-8">
								<input type="text" class="text-center form-control form-control-sm" v-model="match.score.home" @input="score(item)" @focus="e => e.target.select()">
							</td>
							<td class="p-1 w-8">
								<input type="text" class="text-center form-control form-control-sm" v-model="match.score.away" @input="score(item)" @focus="e => e.target.select()">
							</td>
							<td class="p-1"><span class="tag mr-1" :class="'tag_'+match.teams.away.color">{{match.teams.away.name}}</span><i class="fa fa-flag" v-if="match.score.away > match.score.home"></i></td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="table-responsive border-top">
				<table class="table table-hover table-outline table-vcenter text-nowrap card-table">
					<tbody>
						<tr>
							<th></th>
							<th>Pts</th>
							<th>PJ</th>
							<th>PG</th>
							<th>PE</th>
							<th>PP</th>
							<th>DIF</th>
						</tr>
						<tr v-for="(team, k) in gral.filter(e => e.pool == item.pool)"  :class="{'table_success': k == 0, 'table_warning': k == 1 , 'table_danger': k == 2 }"> 
							<td class="p-1">
								<span class="tag mr-1" :class="'tag_' + team.color">{{team.name}}</span>
							</td>
							<td class="p-1">{{team.pts}}</td>
							<td class="p-1">{{team.pj}}</td>
							<td class="p-1">{{team.pg}}</td>
							<td class="p-1">{{team.pe}}</td>
							<td class="p-1">{{team.pp}}</td>
							<td class="p-1">{{team.dif}}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="card mt-3" v-if="gral.length">
			<div class="card-header">
				<h3 class="card-title">GRAL</h3>
			</div>
			<div class="table-responsive border-top">
				<table class="table table-hover table-outline table-vcenter text-nowrap card-table">
					<tbody>
						<tr>
							<th class="p-1">GRUPO</th>
							<th class="p-1">EQUIPO</th>
							<th class="p-1">Pts</th>
							<th class="p-1">PJ</th>
							<th class="p-1">PG</th>
							<th class="p-1">PE</th>
							<th class="p-1">PP</th>
							<th class="p-1">DIF</th>
						</tr>
						<template v-for="(team, k) in gral">
							<tr :class="{'table_success': k < 4, 'table_warning': k>3 && k < 8, 'table_danger': k > 7 && k < 12 }">
								<td class="p-1 w-1">
									<span class="tag">{{team.pool}}</span>
								</td>
								<td class="p-1">
									<span class="tag" :class="'tag_' + team.color">{{team.name}}</span>
								</td>
								<td class="p-1">{{team.pts}}</td>
								<td class="p-1">{{team.pj}}</td>
								<td class="p-1">{{team.pg}}</td>
								<td class="p-1">{{team.pe}}</td>
								<td class="p-1">{{team.pp}}</td>
								<td class="p-1">{{team.dif}}</td>
							</tr>
						</template>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
	import low from 'lowdb'
	import LocalStorage from 'lowdb/adapters/LocalStorage'


	const db = low(new LocalStorage('db'))
	
	db.defaults( { pools: {}, matches: [] }).write()


	export default {

		data(){
			return {
				gral: [],
				playoffs: [],
				pools: db.get('pools').value(),
				matches: db.get('matches').value()
			}
		},
		
		mounted(){
			this.matches.forEach(i => this.score(i))
		},

		watch:{
			pools:{
				deep: true,
				handler(a){
				}
			}
		},

		methods:{
			reset(){
				db.setState({ pools: {}, matches: [] }).write()
				this.pools = {};
				this.matches = [];
				this.gral = [];
				this.playoffs = [];
			},
			generate(){				
				db.set('pools', this.pools).write()
				db.set('matches', this.matches).write()
				
			},
			addTeam(pool){
				var colors = ['blue', 'azure', 'red', 'orange', 'yellow', 'lime', 'green', 'pink', 'teal', 'cyan', 'gray', 'indigo', 'purple', 'gray-dark'];
				var n = Object.values(this.pools[pool]).length +1;
				var name = 'Equipo ' + n;
				var op = prompt("Introduzca su nombre:", name);
				if(op != null && op != ''){
					name = op;
				}

				this.pools[pool]['team_' + n] = { name, pts: 0, pj: 0, pp: 0, pe: 0, pg: 0, dif: 0, color: colors[n] }

				var k = this.matches.findIndex(a => a.pool == pool);
				this.matches[k].matches = robin(Object.keys(this.pools[pool])).reduce((a,b, h) => a.concat(b.map(([home, away], i) => ({ i: (h * this.matches.length) + k, pool, teams: { home: this.pools[pool][home], away: this.pools[pool][away] }, home, away, score: { home: score(), away: score() }}))), [])

				// this.generate();
				this.score(this.matches.find(a => a.pool == pool))
			},
			addPool(){
				'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').some(pool => {
					if(!this.pools.hasOwnProperty(pool)){
						this.pools[pool] = {};
						this.matches.push({ pool, matches: [] })
						db.set('pools', this.pools).write();
						db.set('matches', this.matches).write();
						return 1
					}
				})
			},
			score({ pool, matches }){
				db.set('matches.' + pool, matches).write()

				Object.keys(this.pools[pool]).forEach(team => {
					var pj = matches.filter(({home, away, score}) => (null !== score.home || null !== score.away) && (team == home || team == away))
					this.pools[pool][team].pj = pj.length;
					this.pools[pool][team].pe = pj.filter(e => e.score.home == e.score.away).length 
					this.pools[pool][team].pp = pj.filter(e => team == e.home && e.score.home < e.score.away || team == e.away && e.score.away < e.score.home).length
					this.pools[pool][team].pg = pj.filter(e => team == e.home && e.score.home > e.score.away || team == e.away && e.score.away > e.score.home).length
					this.pools[pool][team].pts = (this.pools[pool][team].pg * 3) + this.pools[pool][team].pe
					this.pools[pool][team].dif = pj.reduce((c, {home, score}) => home == team ? c + score.home - score.away : c + score.away - score.home, 0)
					db.set('pools.' + pool, this.pools[pool]).write()
				})

				this.gral = Object.entries(this.pools).reduce((stats, [pool, teams]) => stats.concat(Object.values(teams).map(t => Object.assign(t, {pool}))), []).sort(function(a, b) {
					if (a.pts > b.pts) return -1;
					if (a.pts < b.pts) return 1;
					if (a.dif > b.dif) return -1;
					if (a.dif < b.dif) return 1;
				})

				if(Object.values(this.pools).every(pool => Object.values(pool).every((team, i, teams) => team.pj == teams.length-1))){
					this.playoffs = getBracket(Object.keys(this.pools).map(p => this.gral.find(t => t.pool == p)))
				}
			}
		}
	}

	function robin(ps) {

		var rs = [], c = 0;
		var n = ps.length;
		var rondas = n % 2 === 1 ? n : n - 1;
		var games = n % 2 === 1 ? ((n-1)/2)+1 : n/2;
		var v = rondas;

		for (var j = 0; j < rondas; j += 1) {
			rs[j] = [];
			for (var i = 0; i < games; i += 1) {
				if(i == 0){
					if(n % 2 === 0){
						rs[j].push(j % 2 === 1 ? [ps[n-1], ps[c]] : [ps[c], ps[n-1]]);
					}
				}
				else{
					v = v > 0 ? v-1 : rondas-1;
					rs[j].push([ps[c], ps[v]]);
				}

				c = c < (rondas-1) ? c+1 : 0;
			}
		}

		return rs;
	}

	function score(){
		return (e => e == 4 ? 0 : e)(Math.floor(Math.random() * (28 - 3)) + 3)
	}

	function getBracket(participants) {
		var base = participants.length;
		var closest = [2,4,8,16,32,64].find(k => k >= base);
		var byes = closest-base;

		if(byes>0){
			base = closest;
		}

		var brackets = [],
		round = 1,
		baseT = base/2,
		baseC = base/2,
		teamMark = 0,
		nextInc	= base/2;

		for(var i=1;i<=(base-1);i++) {
			var	baseR = i/baseT,
			isBye = false;

			if(byes>0 && (i%2!=0 || byes>=(baseT-i))) {
				isBye = true;
				byes--;
			}

			var last = brackets.filter(b => b.next == i)

			brackets.push({
				nro: i,
				next: nextInc + i > base-1 ? null : nextInc+i,
				teams:	round == 1 ? [ participants[teamMark], participants[teamMark+1] ] : last.map(ls => ls.score.home > ls.score.away ? ls.teams[0] : ls.teams[1] ),
				score: (({home, away}) => home == away ? { home, away } : { home: score(), away: score() })({ home: score(), away: score() }),
				round,
				baseR,
				baseT
			});
			
			teamMark+=2;
			
			if(i%2!=0) {
				nextInc--
			}
			
			while(baseR>=1) {
				round++;
				baseC /= 2;
				baseT = baseT + baseC;
				baseR = i/baseT;
			}
		}

		return Object.values((brackets).reduce(function(rv, x) {
					(rv[x.round] = rv[x.round] || []).push(x);
					return rv;
				}, {}));
	}
</script>