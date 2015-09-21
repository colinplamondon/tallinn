returnRandomInt = (min, max) ->
	return Math.floor(Math.random() * (max - min + 1)) + min

dispatchMatches = ->
	photos = testData.test_photos;
	photos_num = photos.length;
	console.log("photos num: " + photos_num);

	random = returnRandomInt(0, photos_num);
	console.log("random: " + random);
	
	result = photos[random];

	app.io.emit('new-match',{
		'profile_pic': result,
		'all_pics': [],
		'match_data': {}
	})

	next_timing = returnRandomInt(2500, 5000)
	setTimeout(dispatchMatches, next_timing)

testData = {
	"test_photos": [
		"http://images.gotinder.com/54dfaed88c6c3be368060902/9aee574c-f571-4b8b-8dff-d9a583ee5213.jpg",
		"http://images.gotinder.com/55fab98b455c3f37335d4e37/e3e7d178-4749-42c7-8a5f-f7cd99090079.jpg",
		"http://images.gotinder.com/55ff027294f9173c21330a61/fef74d75-cd7e-4f19-93e7-6a48a9a21bf6.jpg",
		"http://images.gotinder.com/541c610e5808ac6a14c713fe/9c686c63-1e81-4caa-a729-3031ae182ac8.jpg",
		"http://images.gotinder.com/54fedab6a262c211773cfc63/f3b7c20d-0e5a-4bae-84ef-67c577921ac4.jpg",
		"http://images.gotinder.com/55fedd2538a25c3d5fe79e90/afc996b3-e125-4dd2-8bbb-ab0abf37130d.jpg",
		"http://images.gotinder.com/55fd8105e7837cf25a5ce1b9/a14c894d-2ce6-4cdc-8253-706f8976ab56.jpg",
		"http://images.gotinder.com/535e9bb35a0f7e1a56006b7f/7940e84d-13f1-49a9-83d7-0fec534fe244.jpg",
		"http://images.gotinder.com/54a84fe28a2ea1c8528857f8/a8c77506-739f-49ed-83cd-22f64d095180.jpg",
		"http://images.gotinder.com/53f0d44ad863baa049b88732/cdd36c38-b6fd-4303-843c-c9274b3da64e.jpg",
		"http://images.gotinder.com/55fe90657caf253508ba1c0e/2622161b-b389-4687-80eb-d0b2489bb921.jpg",
		"http://images.gotinder.com/55f1a1a700cd45eb7e097d2f/9e26da43-4702-4c60-a6fd-d5021fd9c7f1.jpg",
		"http://images.gotinder.com/5554cdc3a1b25659549ba7fb/e290073c-bb1c-42fc-8776-286855b61d53.jpg",
		"http://images.gotinder.com/530fe9c0a47e49683900002c/36fa54a8-fbf8-4d83-bf33-3c058fa9bfd8.jpg",
		"http://images.gotinder.com/55c48ca5a31b23d5186614de/c79baf4b-24b1-461f-8713-ce126e1f78a3.jpg",
		"http://images.gotinder.com/543aac050e1508ee469615d8/2970bde4-a171-4c55-86e4-b30c5ae329b5.jpg",
		"http://images.gotinder.com/559983527150f6fe75d5de15/ff6096d0-287b-4194-b335-463873819474.jpg",
		"http://images.gotinder.com/539f4ee8fbd7413e0c8b6173/ead5691a-78df-4cf9-85bc-d9728b803701.jpg",
		"http://images.gotinder.com/5406f2410da4ffc648582ff9/4c74f0fc-73d5-422e-9e99-4143f428546a.jpg",
		"http://images.gotinder.com/5478b4676962bad11816ee09/c517515a-fcad-4697-bcfa-8aecfb5cbca3.jpg",
		"http://images.gotinder.com/55fc7da8dc631fda3b30ff34/3dd67e85-90b7-4cec-b599-f07d62762222.jpg",
		"http://images.gotinder.com/5579b8ddb3fd4f437fe8d628/70491573-3a0c-40ba-8520-c7b861b525fb.jpg",
		"http://images.gotinder.com/55d66346abef4efc0c6e7091/1c5edc74-e409-4a18-bd59-1d3ed78a4c5f.jpg",
		"http://images.gotinder.com/55f8345a8e1a86890825a637/b7dfc87b-d691-47aa-8543-398c494b2acd.jpg",
		"http://images.gotinder.com/54d6a74acabd3be4486fdac6/ade3a393-1c24-477d-874d-4cd4201e3365.jpg",
		"http://images.gotinder.com/5491770e3794a2cf7261632d/0659bf49-acee-44a0-84cf-77f0040ad8a0.jpg",
		"http://images.gotinder.com/55b4dc173bbe98f40a6061d8/61437849-dd66-43cc-88a3-e18b8c807af3.jpg",
		"http://images.gotinder.com/550493ba5b525a5964fabb24/30ac63a4-c95b-4da6-8bf8-f75b7a5154d0.jpg",
		"http://images.gotinder.com/52d6ea8fe98e12ee0300048a/f14f1102-8348-4177-9bf1-9069c02c6c7e.jpg",
		"http://images.gotinder.com/55f5c70fd88c719e30554e6a/d3a324a1-385c-4e16-b93d-afc66c0d2078.jpg",
		"http://images.gotinder.com/5558f060f695bab154d9b11e/afd24d11-8856-427c-a589-61a6fb0bd710.jpg",
		"http://images.gotinder.com/5511bcc7f311849e0cf66355/40b56761-70cd-4b0a-8a4c-af62ad6fedfb.jpg",
		"http://images.gotinder.com/55f1a1a700cd45eb7e097d2f/9e26da43-4702-4c60-a6fd-d5021fd9c7f1.jpg",
		"http://images.gotinder.com/559983527150f6fe75d5de15/ff6096d0-287b-4194-b335-463873819474.jpg",
		"http://images.gotinder.com/530fe9c0a47e49683900002c/36fa54a8-fbf8-4d83-bf33-3c058fa9bfd8.jpg",
		"http://images.gotinder.com/543aac050e1508ee469615d8/2970bde4-a171-4c55-86e4-b30c5ae329b5.jpg",
		"http://images.gotinder.com/5478b4676962bad11816ee09/c517515a-fcad-4697-bcfa-8aecfb5cbca3.jpg",
		"http://images.gotinder.com/533be638855fa921230053d9/9b63a01c-f36f-497d-90b0-36aa7809c841.jpg",
		"http://images.gotinder.com/5554cdc3a1b25659549ba7fb/e290073c-bb1c-42fc-8776-286855b61d53.jpg",
		"http://images.gotinder.com/55c48ca5a31b23d5186614de/c79baf4b-24b1-461f-8713-ce126e1f78a3.jpg",
		"http://images.gotinder.com/5406f2410da4ffc648582ff9/4c74f0fc-73d5-422e-9e99-4143f428546a.jpg",
		"http://images.gotinder.com/539f4ee8fbd7413e0c8b6173/ead5691a-78df-4cf9-85bc-d9728b803701.jpg"
	]
}

app = null
module.exports = (newApp) ->
	app = newApp

setTimeout(dispatchMatches, 5000)